import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from '../../products/models/product.model';

@Schema({ timestamps: true })
export class ProductSizes extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true,
  })
  productId: Product;

  @Prop({ type: String, required: true })
  size: string;

  @Prop({ type: Number, required: true })
  count: number;
}

export const ProductSizesSchema = SchemaFactory.createForClass(ProductSizes);
