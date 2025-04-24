import { Module } from '@nestjs/common';
import { BrandsController } from './controllers/brands.controller';
import { BrandsService } from './services/brands.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from './models/brand.model';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService],
  imports: [
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
  ],
})
export class BrandsModule {}
