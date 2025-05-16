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

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  @ApiOperation({ summary: 'Создание нового продукта' })
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
  @ApiOperation({ summary: 'Поиск продуктов с фильтрацией и пагинацией' })
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
  @ApiOperation({ summary: 'Получение всех продуктов' })
  @ApiOkResponse({
    description: 'Список всех продуктов',
    type: [Product],
  })
  async getAll(): Promise<Product[]> {
    return await this.productsService.getAll();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Получение продукта по ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID продукта' })
  @ApiOkResponse({
    description: 'Найденный продукт',
    type: Product,
  })
  async getProductByID(@Param('id') id: string): Promise<Product | null> {
    return await this.productsService.getProductByID(id);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Удаление продукта по ID' })
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
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  @ApiOperation({ summary: 'Обновление информации о продукте' })
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
