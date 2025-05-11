import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReviewService } from '../services/review.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Review } from '../models/review.model';

@Controller('products/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('/create')
  @UseInterceptors(FilesInterceptor('images'))
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() body: { data: string },
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<void> {
    const createReviewDto = JSON.parse(body.data) as CreateReviewDto;
    await this.reviewService.createReview(createReviewDto, images);
  }

  @Get('/get')
  async getReviews(@Param('productId') productId: string): Promise<Review[]> {
    return this.reviewService.getProductReviews(productId);
  }
}
