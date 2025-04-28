import { Module } from '@nestjs/common';
import { ReviewController } from './controllers/review.controller';
import { ReviewService } from './services/review.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './models/review.model';
import { ProductsModule } from '../products/products.module';
import { AuthModule } from '../auth/auth.module';
import { ParentProductModule } from '../parent-product/parent-product.module';
import { FilesModule } from '../files/files.module';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    ProductsModule,
    ParentProductModule,
    AuthModule,
    FilesModule,
  ],
})
export class ReviewModule {}
