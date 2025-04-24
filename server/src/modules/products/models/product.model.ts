import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IProduct } from '../interfaces/product.interface';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document implements IProduct {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  // @Prop({ type: [String], required: true })
  // sizes: string[];

  // @Prop({ type: [String], required: true })
  // colors: string[];

  @Prop({ type: [String], required: true })
  categories: string[];

  @Prop({ type: [String] })
  images?: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Number, default: 0, minimum: 0, maximum: 5 })
  averageRating?: number;

  @Prop({ type: Number, default: 0, minimum: 0 })
  reviewCount?: number;

  @Prop({ default: 0 })
  discount?: number;

  @Prop({ type: String, required: true })
  brand: string;
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
