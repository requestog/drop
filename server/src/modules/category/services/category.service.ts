import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CategoryCreateDto } from '../dto/category-create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from '../models/category.model';
import { Model, Types } from 'mongoose';
import { Product } from '../../products/models/product.model';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async createCategory(dto: CategoryCreateDto): Promise<void> {
    try {
      await this.categoryModel.create({ ...dto });
    } catch (error) {
      throw new Error('Error create category', error.message);
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      const objectId = new Types.ObjectId(id);
      const category = await this.categoryModel.findById(objectId);
      if (!category)
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);

      await this.categoryModel.findByIdAndDelete(objectId);

      await this.productModel.updateMany(
        { categories: objectId },
        { $pull: { categories: objectId } },
      );
    } catch {
      throw new HttpException(
        'Error occurred while deleting category',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateCategory(id: string, dto): Promise<void> {
    try {
      const objectId = new Types.ObjectId(id);
      const category = await this.categoryModel.findById(objectId);
      if (!category)
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);

      if (dto.name !== undefined) category.name = dto.name;
      if (dto.isActive !== undefined) category.isActive = dto.isActive;

      await category.save();
    } catch {
      throw new HttpException(
        'Error updating category',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
