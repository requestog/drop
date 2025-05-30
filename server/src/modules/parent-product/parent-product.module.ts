import { forwardRef, Module } from '@nestjs/common';
import { ParentProductController } from './controllers/parent-product.controller';
import { ParentProductService } from './services/parent-product.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ParentProduct,
  ParentProductSchema,
} from './models/parent-product.model';
import { ProductsModule } from '../products/products.module';
import { ReviewModule } from '../review/review.module';
import { Review, ReviewSchema } from '../review/models/review.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ParentProductController],
  providers: [ParentProductService],
  imports: [
    MongooseModule.forFeature([
      { name: ParentProduct.name, schema: ParentProductSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
    ProductsModule,
    AuthModule,
    forwardRef(() => ReviewModule),
  ],
  exports: [
    MongooseModule.forFeature([
      { name: ParentProduct.name, schema: ParentProductSchema },
    ]),
    ParentProductService,
  ],
})
export class ParentProductModule {}
