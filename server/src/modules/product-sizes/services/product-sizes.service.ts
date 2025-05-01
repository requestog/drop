import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductSizesCreateDto } from '../dto/product-sizes-create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProductSizes } from '../models/product-sizes.model';
import { Model, Types } from 'mongoose';
import { Product } from '../../products/models/product.model';
import { ProductSizesUpdateDto } from '../dto/product-sizes-update.dto';

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
      const objectId = new Types.ObjectId(id);
      const productSize = await this.productSizesModel.findById(objectId);
      if (!productSize)
        throw new HttpException(
          `Failed to delete product: ${id}`,
          HttpStatus.NOT_FOUND,
        );
      await this.productSizesModel.findByIdAndDelete(objectId);
      await this.productModel.updateMany(
        { categories: objectId },
        { $pull: { categories: objectId } },
      );
    } catch {
      throw new HttpException(
        'Error occurred while deleting product size',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateSize(id: string, dto: ProductSizesUpdateDto) {
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
