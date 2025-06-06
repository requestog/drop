import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
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

  private readonly logger: Logger = new Logger('ProductSizesService');

  async createSize(dto: ProductSizesCreateDto): Promise<void> {
    try {
      const size = new this.productSizesModel({
        ...dto,
        productId: new Types.ObjectId(dto.productId),
      });
      await size.save();

      await this.productModel.findByIdAndUpdate(dto.productId, {
        $push: { sizes: size._id },
      });
    } catch (error) {
      this.logger.error(
        `Failed to create product size: ${error.message}`,
        error.stack,
      );
      throw new NotFoundException(
        `Failed to create product size: ${error.message}`,
      );
    }
  }

  async deleteSize(id: string): Promise<void> {
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
    } catch (error) {
      this.logger.error(
        `Error occurred while deleting product size: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Error occurred while deleting product size',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateSize(id: string, dto: ProductSizesUpdateDto): Promise<void> {
    try {
      const size = await this.productSizesModel.findOne({ _id: id });
      if (!size) throw new NotFoundException('Size not found');

      if (dto.size !== undefined) size.size = dto.size;
      if (dto.count !== undefined) size.count = dto.count;
      await size.save();
    } catch (error) {
      this.logger.error(`Failed to update size: ${error.message}`, error.stack);
      throw new Error(`Failed to update size: ${error.message}`);
    }
  }
}
