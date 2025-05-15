import { Injectable, Logger } from '@nestjs/common';
import { CreateReviewDto } from '../dto/create-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review } from '../models/review.model';
import { ParentProduct } from '../../parent-product/models/parent-product.model';
import { Product } from '../../products/models/product.model';
import { FilesService } from '../../files/files.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel('Review') private readonly reviewModel: Model<Review>,
    @InjectModel(ParentProduct.name)
    private parentProductModel: Model<ParentProduct>,
    @InjectModel(Product.name)
    private productModel: Model<Product>,
    private readonly fileService: FilesService,
  ) {}

  private readonly logger: Logger = new Logger('ReviewService');

  async createReview(
    createReviewDto: CreateReviewDto,
    images: Express.Multer.File[],
  ): Promise<void> {
    try {
      const imageUrls: (string | undefined)[] = images?.length
        ? await Promise.all(
            images.map(
              (image: Express.Multer.File): Promise<string | undefined> =>
                this.fileService.saveFile(image, 'reviews'),
            ),
          )
        : [];

      const reviewModel = new this.reviewModel({
        parentProductId: new Types.ObjectId(createReviewDto.parentProductId),
        user: new Types.ObjectId(createReviewDto.user),
        productId: new Types.ObjectId(createReviewDto.productId),
        rating: createReviewDto.rating,
        comment: createReviewDto?.comment,
        images: imageUrls.filter(
          (url: string | undefined): url is string => url !== undefined,
        ) as string[],
      });

      const { _id } = await reviewModel.save();

      await this.updateProductRating(createReviewDto.productId, _id);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to create review: ${error.message}`,
          error.stack,
        );
        throw new Error(`Failed to create review: ${error.message}`);
      }
      this.logger.error(
        `Failed to create review: ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to create review');
    }
  }

  private async updateProductRating(
    productId: string,
    reviewId,
  ): Promise<void> {
    try {
      const product = await this.productModel.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const reviews = await this.reviewModel.find({
        productId: new Types.ObjectId(productId),
      });
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      );
      const averageRating =
        reviews.length > 0 ? totalRating / reviews.length : 0;

      await this.parentProductModel.findByIdAndUpdate(product.parentProductId, {
        averageRating,
        reviewCount: reviews.length,
        $push: { reviews: reviewId },
      });
    } catch (error) {
      this.logger.error(
        `Failed to update review: ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to update review');
    }
  }

  async getProductReviews(productId: string): Promise<Review[]> {
    try {
      return this.reviewModel
        .find({ product: productId })
        .populate('user', 'nickName');
    } catch (error) {
      this.logger.error(`Failed to get reviews: ${error.message}`, error.stack);
      throw new Error('Failed to get reviews');
    }
  }
}
