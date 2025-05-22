import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { ProductCreateDto } from '../dto/product-create.dto';
import { Product } from '../models/product.model';
import { SearchProductsDto } from '../dto/search-products.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { ProductUpdateDto } from '../dto/product-update.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedProductsResponseDto } from '../dto/paginated-products-response.dto';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/interfaces/role.interface';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FilesInterceptor('images'))
  @ApiOperation({
    summary: 'Создание нового продукта',
    description:
      'Добавление нового товара в каталог.' +
      ' Доступно только администраторам.' +
      ' Требует основных данных о продукте и загрузки изображений.',
  })
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'string',
          description: 'JSON строка с данными продукта (ProductCreateDto)',
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Изображения продукта',
        },
      },
      required: ['data'],
    },
  })
  @ApiCreatedResponse({
    description: 'Продукт успешно создан',
    type: Product,
  })
  async createProduct(
    @Body() body: { data: string },
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<void> {
    const rawData = JSON.parse(body.data);
    const createProductDto: ProductCreateDto = plainToClass(
      ProductCreateDto,
      rawData,
    );
    await this.productsService.createProduct(createProductDto, images);
  }

  @Post('search')
  @UseGuards(RolesGuard)
  @Roles(Role.CUSTOMER)
  @ApiOperation({
    summary: 'Поиск продуктов с фильтрацией и пагинацией',
    description:
      'Поиск товаров по различным критериям' +
      ' с возможностью фильтрации и постраничной загрузки.',
  })
  @ApiBody({ type: SearchProductsDto })
  @ApiOkResponse({
    description: 'Список найденных продуктов с метаданными пагинации',
    type: PaginatedProductsResponseDto,
  })
  async searchProducts(
    @Body() dto: SearchProductsDto,
  ): Promise<PaginatedProductsResponseDto> {
    return this.productsService.search(dto);
  }

  @Get('/getAll')
  @UseGuards(RolesGuard)
  @Roles(Role.CUSTOMER)
  @ApiOperation({
    summary: 'Получение всех продуктов',
    description: 'Получение полного списка товаров из каталога.',
  })
  @ApiOkResponse({
    description: 'Список всех продуктов',
    type: [Product],
  })
  async getAll(): Promise<Product[]> {
    return await this.productsService.getAll();
  }

  @Get('/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.CUSTOMER)
  @ApiOperation({
    summary: 'Получение продукта по ID',
    description:
      'Получение детальной информации о конкретном товаре по его идентификатору.',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'ID продукта' })
  @ApiOkResponse({
    description: 'Найденный продукт',
    type: Product,
  })
  async getProductByID(@Param('id') id: string): Promise<Product | null> {
    return await this.productsService.getProductByID(id);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Удаление продукта по ID',
    description:
      'Полное удаление товара из системы по его идентификатору. Доступно только администраторам.',
  })
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID продукта для удаления',
  })
  @ApiOkResponse({ description: 'Продукт успешно удален' })
  async deleteByID(@Param('id') id: string): Promise<void> {
    await this.productsService.deleteProduct(id);
  }

  @Patch('/update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  @ApiOperation({
    summary: 'Обновление информации о продукте',
    description:
      'Изменение данных существующего товара,' +
      ' включая обновление изображений.' +
      ' Доступно только администраторам.',
  })
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID продукта для обновления',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'string',
          description:
            'JSON строка с данными для обновления продукта (ProductUpdateDto)',
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Новые изображения продукта',
        },
      },
      required: ['data'],
    },
  })
  @ApiOkResponse({ description: 'Информация о продукте успешно обновлена' })
  async updateProduct(
    @Param('id') id: string,
    @Body()
    body: {
      data: string;
    },
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<void> {
    const rawData = JSON.parse(body.data);
    const productUpdateDto: ProductUpdateDto = plainToClass(
      ProductUpdateDto,
      rawData,
    );
    await this.productsService.updateProduct(id, productUpdateDto, images);
  }
}
