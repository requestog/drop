import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CategoryCreateDto } from '../dto/category-create.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  async createCategory(@Body() dto: CategoryCreateDto): Promise<void> {
    await this.categoryService.createCategory(dto);
  }

  @Delete('/delete/:id')
  async deleteCategory(@Param('id') id: string): Promise<void> {
    await this.categoryService.deleteCategory(id);
  }

  @Patch('/update/:id')
  async updateCategory(@Param('id') id: string, @Body() dto): Promise<void> {
    await this.categoryService.updateCategory(id, dto);
  }
}
