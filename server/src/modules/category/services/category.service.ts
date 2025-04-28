import { Injectable } from '@nestjs/common';
import { CategoryCreateDto } from '../dto/category-create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from '../models/category.model';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async createCategory(dto: CategoryCreateDto) {
    await this.categoryModel.create({ ...dto });
  }
}
