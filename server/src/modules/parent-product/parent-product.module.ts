import { Module } from '@nestjs/common';
import { ParentProductController } from './controllers/parent-product.controller';
import { ParentProductService } from './services/parent-product.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ParentProduct,
  ParentProductSchema,
} from './models/parent-product.model';

@Module({
  controllers: [ParentProductController],
  providers: [ParentProductService],
  imports: [
    MongooseModule.forFeature([
      { name: ParentProduct.name, schema: ParentProductSchema },
    ]),
  ],
  exports: [
    MongooseModule.forFeature([
      { name: ParentProduct.name, schema: ParentProductSchema },
    ]),
  ],
})
export class ParentProductModule {}
