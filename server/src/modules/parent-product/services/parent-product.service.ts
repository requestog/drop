import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ParentProduct } from '../models/parent-product.model';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ParentProductCreateDto } from '../dto/parent-product-create.dto';
import { ProductsService } from '../../products/services/products.service';
import { Review } from '../../review/models/review.model';

@Injectable()
export class ParentProductService {
  constructor(
    @InjectModel(ParentProduct.name)
    private readonly parentProductModel: Model<ParentProduct>,
    private readonly productService: ProductsService,
    @InjectModel(Review.name)
    private readonly reviewModel: Model<Review>,
  ) {}

  async createParentProduct(dto: ParentProductCreateDto): Promise<void> {
    await this.parentProductModel.create({
      ...dto,
      brand: new Types.ObjectId(dto.brand),
    });
  }

  async deleteParentProduct(id: string): Promise<void> {
    try {
      const parentProduct = await this.parentProductModel.findOne({ _id: id });
      if (!parentProduct) new NotFoundException('Parent product not found');
      await this.parentProductModel.deleteOne({ _id: id });
      await this.reviewModel.deleteMany({
        productId: new Types.ObjectId(id),
      });
      if (parentProduct?.products) {
        for (const product of parentProduct.products) {
          await this.productService.deleteProduct(String(product._id));
        }
      }
    } catch {
      throw new HttpException(
        'Error deleting parent product',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
