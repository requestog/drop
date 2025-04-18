import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IProduct } from '../interfaces/product.interface';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document implements IProduct {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: [String], required: true })
  sizes: string[];

  @Prop({ type: [String], required: true })
  colors: string[];

  @Prop({ type: [String], required: true })
  categories: string[];

  @Prop({ type: [String] })
  images?: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  discount?: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
