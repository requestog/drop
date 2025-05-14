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

@ApiTags('Product Sizes')
@Controller('product-sizes')
export class ProductSizesController {
  constructor(private readonly productSizesService: ProductSizesService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Создание нового размера продукта' })
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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Удаление размера продукта по ID' })
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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Обновление информации о размере продукта' })
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
