import { Body, Controller, Post } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CategoryCreateDto } from '../dto/category-create.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  async createCategory(@Body() dto: CategoryCreateDto): Promise<void> {
    await this.categoryService.createCategory(dto);
  }
}
