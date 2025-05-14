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

@ApiTags('Categories')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Создание новой категории' })
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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Удаление категории по ID' })
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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Обновление информации о категории' })
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID категории для обновления',
  })
  @ApiBody({ type: CategoryCreateDto }) // Используем CategoryCreateDto для обновления (может потребоваться отдельный UpdateDto)
  @ApiOkResponse({ description: 'Информация о категории успешно обновлена' })
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: CategoryCreateDto,
  ): Promise<void> {
    await this.categoryService.updateCategory(id, dto);
  }
}
