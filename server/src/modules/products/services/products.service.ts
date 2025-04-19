import { Injectable } from '@nestjs/common';
import { Product } from '../models/product.model';
import { ProductCreateDto } from '../dto/product.create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async createProduct(createProductDto: ProductCreateDto): Promise<Product> {
    try {
      const newProduct: Product = new this.productModel({
        ...createProductDto,
      });
      const savedProduct: Product = await newProduct.save();
      return savedProduct;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getAll(): Promise<Product[]> {
    try {
      return this.productModel.find({});
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getProductByID(id: string): Promise<Product | null> {
    try {
      return this.productModel.findById(id);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteByID(id: string): Promise<void> {
    try {
      await this.productModel.findByIdAndDelete(id).exec();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
