import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from '../dto/create-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from '../models/review.model';
import { ParentProduct } from '../../parent-product/models/parent-product.model';
import { Product } from '../../products/models/product.model';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel('Review') private readonly reviewModel: Model<Review>,
    @InjectModel(ParentProduct.name)
    private parentProductModel: Model<ParentProduct>,
    @InjectModel(Product.name)
    private productModel: Model<Product>,
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
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const reviews = await this.reviewModel.find({ product: productId });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    await this.parentProductModel.findByIdAndUpdate(product.parentProductId, {
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
