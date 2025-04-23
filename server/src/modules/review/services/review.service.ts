import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from '../dto/create-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from '../models/review.model';
import { Product } from '../../products/models/product.model';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel('Review') private readonly reviewModel: Model<Review>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async createReview(productId: string, createReviewDto: CreateReviewDto) {
    await this.reviewModel.create({
      product: productId,
      user: createReviewDto.userId,
      rating: createReviewDto.rating,
      comment: createReviewDto?.comment,
    });

    await this.updateProductRating(productId);
  }

  private async updateProductRating(productId: string) {
    const reviews = await this.reviewModel.find({ product: productId });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    await this.productModel.findByIdAndUpdate(productId, {
      averageRating,
      reviewCount: reviews.length,
    });
  }

  async getProductReviews(productId: string): Promise<Review[]> {
    return this.reviewModel
      .find({ product: productId })
      .populate('user', 'nickName');
  }
}
