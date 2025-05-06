import { Module } from '@nestjs/common';
import { BrandsController } from './controllers/brands.controller';
import { BrandsService } from './services/brands.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from './models/brand.model';
import { FilesModule } from '../files/files.module';
import { ParentProductModule } from '../parent-product/parent-product.module';
import { ParentProductSchema } from '../parent-product/models/parent-product.model';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService],
  imports: [
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
    MongooseModule.forFeature([
      { name: ParentProductModule.name, schema: ParentProductSchema },
    ]),
    FilesModule,
    ParentProductModule,
  ],
})
export class BrandsModule {}
