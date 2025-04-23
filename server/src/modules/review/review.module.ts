import { Module } from '@nestjs/common';
import { ReviewController } from './controllers/review.controller';
import { ReviewService } from './services/review.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './models/review.model';
import { ProductsModule } from '../products/products.module';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    ProductsModule,
  ],
})
export class ReviewModule {}
