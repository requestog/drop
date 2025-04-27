import { Injectable } from '@nestjs/common';
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
    const size = new this.productSizesModel({
      ...dto,
    });
    await size.save();

    await this.productModel.findByIdAndUpdate(dto.productId, {
      $push: { sizes: size._id },
    });
  }
}
