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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Product Reviews')
@Controller('products/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('/create')
  @UseInterceptors(FilesInterceptor('images'))
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Создание нового отзыва к продукту' })
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'string',
          description: 'JSON строка с данными отзыва (CreateReviewDto)',
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Изображения к отзыву (опционально)',
        },
      },
      required: ['data'],
    },
  })
  @ApiCreatedResponse({
    description: 'Отзыв успешно создан',
    type: Review,
  })
  async create(
    @Body() body: { data: string },
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<void> {
    const createReviewDto = JSON.parse(body.data) as CreateReviewDto;
    await this.reviewService.createReview(createReviewDto, images);
  }

  @Get('/get/:productId')
  @ApiOperation({ summary: 'Получение отзывов по ID продукта' })
  @ApiParam({ name: 'productId', type: 'string', description: 'ID продукта' })
  @ApiOkResponse({
    description: 'Список отзывов к продукту',
    type: [Review],
  })
  async getReviews(@Param('productId') productId: string): Promise<Review[]> {
    return this.reviewService.getProductReviews(productId);
  }
}
