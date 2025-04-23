import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReviewService } from '../services/review.service';
import { CreateReviewDto } from '../dto/create-review.dto';

@Controller('products/:productId/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('/create')
  async create(
    @Param('productId') productId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    await this.reviewService.createReview(productId, createReviewDto);
  }

  @Get()
  async getReviews(@Param('productId') productId: string) {
    return this.reviewService.getProductReviews(productId);
  }
}
