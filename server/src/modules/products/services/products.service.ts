import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Product } from '../models/product.model';
import { ProductCreateDto } from '../dto/product-create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SearchProductsDto } from '../dto/search-products.dto';
import PaginatedProducts from '../interfaces/paginated-products.dto';
import { FilesService } from '../../files/files.service';
import { ParentProduct } from '../../parent-product/models/parent-product.model';
import { ProductSizes } from '../../product-sizes/models/product-sizes.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly fileService: FilesService,
    @InjectModel(ParentProduct.name)
    private readonly parentProductModel: Model<ParentProduct>,
    @InjectModel(ProductSizes.name)
    private readonly productSizeModel: Model<ProductSizes>,
  ) {}

  async createProduct(
    dto: ProductCreateDto,
    images: Express.Multer.File[],
  ): Promise<void> {
    try {
      const imageUrls: (string | undefined)[] = images?.length
        ? await Promise.all(
            images.map(
              (image: Express.Multer.File): Promise<string | undefined> =>
                this.fileService.createFile(image),
            ),
          )
        : [];

      const newProduct = new this.productModel({
        ...dto,
        brandId: new Types.ObjectId(dto.brandId),
        parentProductId: new Types.ObjectId(dto.parentProductId),
        images: imageUrls.filter(
          (url: string | undefined): url is string => url !== undefined,
        ) as string[],
      });
      await newProduct.save();

      await this.parentProductModel.findByIdAndUpdate(dto.parentProductId, {
        $push: { products: newProduct._id },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create product: ${error.message}`);
      }
      throw new Error('Failed to create product');
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
      return this.productModel
        .findById(id)
        .populate('brandId', 'name img')
        .populate({
          path: 'parentProductId',
          select: 'name averageRating reviewCount -_id',
          populate: {
            path: 'reviews',
            select: 'comment rating -_id',
            populate: {
              path: 'user',
              select: 'nickName -_id',
            },
          },
        })
        .populate({
          path: 'parentProductId',
          populate: {
            path: 'products',
            select: 'name images',
          },
        })
        .populate('sizes', 'size count -_id');
    } catch (error) {
      throw new InternalServerErrorException(
        'Ошибка при получении продукта',
        error,
      );
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const objectId = new Types.ObjectId(id);
      const product = await this.productModel.findById(objectId);
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      await this.productModel.findByIdAndDelete(objectId);
      await this.productSizeModel.deleteMany({ productId: objectId });
    } catch {
      throw new HttpException('Error deleting product', HttpStatus.BAD_REQUEST);
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
