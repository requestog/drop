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
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/interfaces/role.interface';

@ApiTags('Parent Product')
@Controller('parent-product')
export class ParentProductController {
  constructor(private readonly parentProductService: ParentProductService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Создание новой родительской категории продукта',
    description:
      'Создание новой родительской категории для продуктов.' +
      ' Доступно только администраторам. Требует названия и описания категории.',
  })
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Удаление родительской категории продукта по ID',
    description:
      'Удаление родительской категории продуктов по её идентификатору.' +
      ' Доступно только администраторам. Удаляет категорию и все связанные с ней продукты.',
  })
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
