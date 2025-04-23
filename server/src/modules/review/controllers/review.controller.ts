import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReviewService } from '../services/review.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('products/:productId/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
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
