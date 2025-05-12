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
import { ProductUpdateDto } from '../dto/product-update.dto';

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
    images?: Express.Multer.File[],
  ): Promise<void> {
    try {
      const imageUrls: (string | undefined)[] = images?.length
        ? await Promise.all(
            images.map(
              (image: Express.Multer.File): Promise<string | undefined> =>
                this.fileService.saveFile(image),
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
      await this.parentProductModel.updateMany(
        { _id: product.parentProductId },
        { $pull: { products: objectId } },
      );
    } catch {
      throw new HttpException('Error deleting product', HttpStatus.BAD_REQUEST);
    }
  }

  async search(dto: SearchProductsDto): Promise<PaginatedProducts> {
    const pipeline: any = [];

    if (dto.query) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: dto.query, $options: 'i' } },
            { description: { $regex: dto.query, $options: 'i' } },
          ],
        },
      });
    }

    if (dto.categories) {
      pipeline.push({
        $match: {
          categories: {
            $in: dto.categories.map((id) => new Types.ObjectId(id)),
          },
        },
      });
    }

    if (dto.color) {
      pipeline.push({
        $match: { color: { $in: dto.color } },
      });
    }

    if (dto.price) {
      const priceFilter: any = {};
      if (dto.price.min) priceFilter.$gte = dto.price.min;
      if (dto.price.max) priceFilter.$lte = dto.price.max;
      pipeline.push({ $match: { price: priceFilter } });
    }

    if (dto.sizes) {
      pipeline.push({
        $lookup: {
          from: 'productsizes',
          localField: '_id',
          foreignField: 'productId',
          as: 'productSizes',
        },
      });
      pipeline.push({
        $match: {
          'productSizes.size': { $in: dto.sizes },
        },
      });

      pipeline.push({
        $unwind: '$productSizes',
      });
      pipeline.push({
        $group: {
          _id: '$_id',
          root: { $first: '$$ROOT' },
        },
      });
      pipeline.push({ $replaceRoot: { newRoot: '$root' } });
    }

    if (dto.inStock) {
      pipeline.push({ $match: { stock: { $gt: 0 } } });
    }

    if (dto.brandId) {
      pipeline.push({ $match: { brandId: new Types.ObjectId(dto.brandId) } });
    }

    const sortStage: any = {};
    if (dto.sort?.field === 'averageRating') {
      const lookupRating = pipeline.find(
        (stage) => stage.$lookup?.as === 'parentProduct',
      );
      if (!lookupRating) {
        pipeline.push({
          $lookup: {
            from: 'parentproducts',
            localField: 'parentProductId',
            foreignField: '_id',
            as: 'parentProduct',
            pipeline: [{ $project: { _id: 0, averageRating: 1 } }],
          },
        });
        pipeline.push({ $unwind: '$parentProduct' });
      }
      sortStage.$sort = {
        'parentProduct.averageRating': dto.sort.order === 'asc' ? 1 : -1,
      };
    } else if (dto.sort?.field) {
      sortStage.$sort = { [dto.sort.field]: dto.sort.order === 'asc' ? 1 : -1 };
    }
    if (Object.keys(sortStage).length > 0) {
      pipeline.push(sortStage);
    }

    const skip =
      dto.pagination?.page && dto.pagination?.limit
        ? (dto.pagination.page - 1) * dto.pagination.limit
        : 0;
    const limit = dto.pagination?.limit || 20;

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const items = await this.productModel.aggregate(pipeline).exec();

    const countPipeline = [...pipeline];
    countPipeline.pop();
    countPipeline.pop();
    countPipeline.push({ $count: 'total' });
    const totalResult = await this.productModel.aggregate(countPipeline).exec();
    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    return {
      items,
      total,
      page: dto.pagination?.page,
      limit: dto.pagination?.limit,
    };
  }

  async updateProduct(
    id: string,
    dto: ProductUpdateDto & { imagesToDelete?: string[] },
    images?: Express.Multer.File[],
  ): Promise<void> {
    try {
      const product = await this.productModel.findOne({ _id: id });
      if (!product)
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

      let imageUrls: string[] = [];
      if (images?.length) {
        imageUrls = (
          await Promise.all(
            images.map((image) => this.fileService.saveFile(image)),
          )
        ).filter((url): url is string => url !== undefined);
      }

      let updatedImages: string[] = product.images ? [...product.images] : [];
      if (dto.imagesToDelete?.length) {
        await Promise.all(
          dto.imagesToDelete.map((url) => this.fileService.deleteFile(url)),
        );

        if (dto.imagesToDelete) {
          updatedImages = updatedImages.filter(
            (imgUrl) => !dto.imagesToDelete?.includes(imgUrl),
          );
        }
      }

      const updateData: any = {
        ...dto,
        images: [...updatedImages, ...imageUrls],
      };

      delete updateData.imagesToDelete;

      if (dto.brandId) {
        updateData.brandId = new Types.ObjectId(dto.brandId);
      }
      if (dto.parentProductId) {
        updateData.parentProductId = new Types.ObjectId(dto.parentProductId);
      }

      await this.productModel.findByIdAndUpdate(id, updateData, { new: true });
    } catch {
      throw new HttpException('Error updating product', HttpStatus.BAD_REQUEST);
    }
  }
}
