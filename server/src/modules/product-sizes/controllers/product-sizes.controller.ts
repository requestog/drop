import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductSizesService } from '../services/product-sizes.service';
import { ProductSizesCreateDto } from '../dto/product-sizes-create.dto';
import { ProductSizesUpdateDto } from '../dto/product-sizes-update.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ProductSizes } from '../models/product-sizes.model';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/interfaces/role.interface';

@ApiTags('Product Sizes')
@Controller('product-sizes')
export class ProductSizesController {
  constructor(private readonly productSizesService: ProductSizesService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Создание нового размера продукта',
    description:
      'Добавление нового варианта размера для товаров.' +
      ' Доступно только администраторам. Требует указания размера и связанных параметров.',
  })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: ProductSizesCreateDto })
  @ApiCreatedResponse({
    description: 'Размер продукта успешно создан',
    type: ProductSizes,
  })
  async createSize(@Body() dto: ProductSizesCreateDto): Promise<void> {
    await this.productSizesService.createSize(dto);
  }

  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Удаление размера продукта по ID',
    description:
      'Удаление конкретного размера товара' +
      ' из системы по его идентификатору. Доступно только администраторам.',
  })
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID размера продукта для удаления',
  })
  @ApiOkResponse({ description: 'Размер продукта успешно удален' })
  async deleteSize(@Param('id') id: string): Promise<void> {
    await this.productSizesService.deleteSize(id);
  }

  @Patch('/update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Обновление информации о размере продукта',
    description:
      'Изменение параметров существующего размера товара.' +
      ' Доступно только администраторам. Позволяет обновить все характеристики размера.',
  })
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID размера продукта для обновления',
  })
  @ApiBody({ type: ProductSizesUpdateDto })
  @ApiOkResponse({
    description: 'Информация о размере продукта успешно обновлена',
  })
  async updateSize(
    @Param('id') id: string,
    @Body() dto: ProductSizesUpdateDto,
  ): Promise<void> {
    await this.productSizesService.updateSize(id, dto);
  }
}
