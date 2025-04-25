import { Module } from '@nestjs/common';
import { ProductSizesController } from './controllers/product-sizes.controller';
import { ProductSizesService } from './services/product-sizes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSize, ProductSizeSchema } from './models/product-sizes.model';

@Module({
  controllers: [ProductSizesController],
  providers: [ProductSizesService],
  imports: [
    MongooseModule.forFeature([
      { name: ProductSize.name, schema: ProductSizeSchema },
    ]),
  ],
  exports: [
    MongooseModule.forFeature([
      { name: ProductSize.name, schema: ProductSizeSchema },
    ]),
  ],
})
export class ProductSizesModule {}
