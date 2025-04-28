import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';
import { Brand } from '../../brands/models/brand.model';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  color: string;

  @Prop({ type: [String] })
  images?: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  discount?: number;

  @Prop({ type: Types.ObjectId, ref: 'Brand', required: true })
  brandId: Brand;

  @Prop({ type: Types.ObjectId, ref: 'ParentProduct', required: true })
  parentProductId: Types.ObjectId;

  @Prop({
    type: [Types.ObjectId],
    ref: 'ProductSizes',
    default: [],
  })
  sizes?: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Category', default: [] })
  categories: Types.ObjectId[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index(
  {
    name: 'text',
    description: 'text',
  },
  {
    weights: {
      name: 3,
      description: 1,
    },
    default_language: 'russian',
    name: 'product_text_index',
  },
);
