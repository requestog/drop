import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IProduct } from '../interfaces/product.interface';
import { Document, Types } from 'mongoose';
import { Brand } from '../../brands/models/brand.model';
import { ParentProduct } from '../../parent-product/models/parent-product.model';

@Schema({ timestamps: true })
export class Product extends Document implements IProduct {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: [String], required: true })
  categories: string[];

  @Prop({ type: [String] })
  images?: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  discount?: number;

  @Prop({ type: Types.ObjectId, ref: 'Brand', required: true })
  brandId: Brand;

  @Prop({ type: Types.ObjectId, ref: 'ParentProduct', required: true })
  parentProductId: ParentProduct;
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
