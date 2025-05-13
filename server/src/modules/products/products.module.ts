import { Module, forwardRef } from '@nestjs/common'; // Добавляем forwardRef
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './models/product.model';
import { FilesModule } from '../files/files.module';
import {
  ParentProduct,
  ParentProductSchema,
} from '../parent-product/models/parent-product.model';
import { ProductSizesModule } from '../product-sizes/product-sizes.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    FilesModule,
    AuthModule,
    forwardRef(() => ProductSizesModule),
    MongooseModule.forFeature([
      { name: ParentProduct.name, schema: ParentProductSchema },
    ]),
  ],
  exports: [
    ProductsService,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
})
export class ProductsModule {}
