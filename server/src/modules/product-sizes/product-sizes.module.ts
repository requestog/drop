import { Module, forwardRef } from '@nestjs/common';
import { ProductSizesController } from './controllers/product-sizes.controller';
import { ProductSizesService } from './services/product-sizes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSizes, ProductSizesSchema } from './models/product-sizes.model';
import { ProductsModule } from '../products/products.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ProductSizesController],
  providers: [ProductSizesService],
  imports: [
    MongooseModule.forFeature([
      { name: ProductSizes.name, schema: ProductSizesSchema },
    ]),
    forwardRef(() => ProductsModule),
    AuthModule,
  ],
  exports: [
    MongooseModule.forFeature([
      { name: ProductSizes.name, schema: ProductSizesSchema },
    ]),
  ],
})
export class ProductSizesModule {}
