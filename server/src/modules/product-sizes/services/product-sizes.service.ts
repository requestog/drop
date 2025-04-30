import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductSizesCreateDto } from '../dto/product-sizes-create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProductSizes } from '../models/product-sizes.model';
import { Model } from 'mongoose';
import { Product } from '../../products/models/product.model';

@Injectable()
export class ProductSizesService {
  constructor(
    @InjectModel(ProductSizes.name)
    private productSizesModel: Model<ProductSizes>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async createSize(dto: ProductSizesCreateDto) {
    try {
      const size = new this.productSizesModel({
        ...dto,
      });
      await size.save();

      await this.productModel.findByIdAndUpdate(dto.productId, {
        $push: { sizes: size._id },
      });
    } catch (error) {
      throw new NotFoundException(`Failed to create product: ${error.message}`);
    }
  }

  async deleteSize(id: string) {
    try {
      await this.productSizesModel.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new NotFoundException(`Failed to delete product: ${error.message}`);
    }
  }

  async updateSize(id: string, dto) {
    try {
      const size = await this.productSizesModel.findOne({ _id: id });
      if (!size) throw new NotFoundException('Size not found');

      if (dto.size !== undefined) size.size = dto.size;
      if (dto.count !== undefined) size.count = dto.count;
      await size.save();
    } catch (error) {
      throw new Error(`Failed to update size: ${error.message}`);
    }
  }
}
