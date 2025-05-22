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
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/interfaces/role.interface';

@ApiTags('Product Reviews')
@Controller('products/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER)
  @UseInterceptors(FilesInterceptor('images'))
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Создание отзыва о продукте',
    description:
      'Добавление нового отзыва с возможностью прикрепления изображений.' +
      ' Доступно только авторизованным пользователям с ролью CUSTOMER.',
  })
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER)
  @ApiOperation({
    summary: 'Получение отзывов продукта',
    description:
      'Получение списка всех отзывов по указанному ID продукта.' +
      ' Доступно только авторизованным пользователям с ролью CUSTOMER.',
  })
  @ApiParam({ name: 'productId', type: 'string', description: 'ID продукта' })
  @ApiOkResponse({
    description: 'Список отзывов к продукту',
    type: [Review],
  })
  async getReviews(@Param('productId') productId: string): Promise<Review[]> {
    return this.reviewService.getProductReviews(productId);
  }
}
