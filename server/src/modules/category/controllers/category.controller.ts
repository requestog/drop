import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CategoryCreateDto } from '../dto/category-create.dto';
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
import { Category } from '../models/category.model';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/interfaces/role.interface';

@ApiTags('Categories')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Создание новой категории',
    description:
      'Создание новой категории товаров. Доступно только администраторам.',
  })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: CategoryCreateDto })
  @ApiCreatedResponse({
    description: 'Категория успешно создана',
    type: Category,
  })
  async createCategory(@Body() dto: CategoryCreateDto): Promise<void> {
    await this.categoryService.createCategory(dto);
  }

  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Удаление категории по ID',
    description:
      'Полное удаление категории по её идентификатору. Доступно только администраторам.',
  })
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID категории для удаления',
  })
  @ApiOkResponse({ description: 'Категория успешно удалена' })
  async deleteCategory(@Param('id') id: string): Promise<void> {
    await this.categoryService.deleteCategory(id);
  }

  @Patch('/update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Обновление информации о категории',
    description:
      'Изменение данных существующей категории (название, описание и др.). Доступно только администраторам.',
  })
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID категории для обновления',
  })
  @ApiBody({ type: CategoryCreateDto })
  @ApiOkResponse({ description: 'Информация о категории успешно обновлена' })
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: CategoryCreateDto,
  ): Promise<void> {
    await this.categoryService.updateCategory(id, dto);
  }
}
