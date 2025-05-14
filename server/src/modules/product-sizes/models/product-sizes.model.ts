import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from '../../products/models/product.model';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class ProductSizes extends Document {
  @ApiProperty({ description: 'ID продукта (MongoDB ObjectId)', type: String })
  @Prop({
    type: Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true,
  })
  productId: Product;

  @ApiProperty({ description: 'Название размера продукта' })
  @Prop({ type: String, required: true })
  size: string;

  @ApiProperty({ description: 'Количество данного размера в наличии' })
  @Prop({ type: Number, required: true })
  count: number;
}

export const ProductSizesSchema = SchemaFactory.createForClass(ProductSizes);
