import { Injectable } from '@nestjs/common';
import { Product } from '../models/product.model';
import { ProductCreateDto } from '../dto/product-create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SearchProductsDto } from '../dto/search-products.dto';
import PaginatedProducts from '../interfaces/paginated-products.dto';

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

  async search(dto: SearchProductsDto): Promise<PaginatedProducts> {
    const filter: any = {};

    if (dto.query) {
      filter.$or = [
        {
          name: {
            $regex: dto.query,
            $options: 'i',
          },
        },
        {
          description: {
            $regex: dto.query,
            $options: 'i',
          },
        },
      ];
    }

    if (dto.categories) {
      filter.category = { $in: dto.categories };
    }

    if (dto.colors) {
      filter.colors = { $in: dto.colors };
    }

    if (dto.price) {
      filter.price = {};
      if (dto.price.min) filter.price.$gte = dto.price.min;
      if (dto.price.max) filter.price.$lte = dto.price.max;
    }

    if (dto.sizes) {
      filter.sizes = { $in: dto.sizes };
    }

    if (dto.averageRating) {
      filter.averageRating = { $in: dto.averageRating };
    }

    if (dto.inStock) {
      filter.stock = { $gt: 0 };
    }

    const sortOptions = {};
    if (dto.sort?.field) {
      sortOptions[dto.sort.field] = dto.sort.order === 'asc' ? 1 : -1;
    }

    const skip: number =
      dto.pagination?.page && dto.pagination?.limit
        ? (dto.pagination.page - 1) * dto.pagination.limit
        : 0;
    const limit: number = dto.pagination?.limit || 20;

    return {
      items: await this.productModel
        .find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      total: await this.productModel.countDocuments(filter),
      page: dto.pagination?.page,
      limit: dto.pagination?.limit,
    };
  }
}
