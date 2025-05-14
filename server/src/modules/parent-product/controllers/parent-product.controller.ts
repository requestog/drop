import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ParentProductCreateDto } from '../dto/parent-product-create.dto';
import { ParentProductService } from '../services/parent-product.service';
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
import { ParentProduct } from '../models/parent-product.model';

@ApiTags('Parent Product')
@Controller('parent-product')
export class ParentProductController {
  constructor(private readonly parentProductService: ParentProductService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Создание новой родительской категории продукта' })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: ParentProductCreateDto })
  @ApiCreatedResponse({
    description: 'Родительская категория продукта успешно создана',
    type: ParentProduct,
  })
  async createParentProduct(
    @Body() dto: ParentProductCreateDto,
  ): Promise<void> {
    await this.parentProductService.createParentProduct(dto);
  }

  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Удаление родительской категории продукта по ID' })
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID родительской категории продукта для удаления',
  })
  @ApiOkResponse({
    description: 'Родительская категория продукта успешно удалена',
  })
  async deleteParentProduct(@Param('id') id: string): Promise<void> {
    await this.parentProductService.deleteParentProduct(id);
  }
}
