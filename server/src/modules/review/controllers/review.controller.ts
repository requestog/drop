import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReviewService } from '../services/review.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('products/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async create(@Body() createReviewDto: CreateReviewDto) {
    await this.reviewService.createReview(createReviewDto);
  }

  @Get()
  async getReviews(@Param('productId') productId: string) {
    return this.reviewService.getProductReviews(productId);
  }
}
