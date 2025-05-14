import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Product extends Document {
  @ApiProperty({ description: 'Название продукта' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'Описание продукта' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ description: 'Цена продукта' })
  @Prop({ required: true })
  price: number;

  @ApiProperty({ description: 'Цвет продукта' })
  @Prop({ required: true })
  color: string;

  @ApiProperty({
    description: 'URL-адреса изображений продукта',
    isArray: true,
    required: false,
  })
  @Prop({ type: [String] })
  images?: string[];

  @ApiProperty({ description: 'Активен ли продукт', default: true })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Скидка на продукт в процентах',
    default: 0,
    required: false,
  })
  @Prop({ default: 0 })
  discount?: number;

  @ApiProperty({ description: 'ID бренда продукта (MongoDB ObjectId)' })
  @Prop({ type: Types.ObjectId, ref: 'Brand', required: true })
  brandId: Types.ObjectId;

  @ApiProperty({ description: 'ID родительского продукта (MongoDB ObjectId)' })
  @Prop({ type: Types.ObjectId, ref: 'ParentProduct', required: true })
  parentProductId: Types.ObjectId;

  @ApiProperty({
    description: 'Массив ID размеров продукта (MongoDB ObjectIds)',
    isArray: true,
    required: false,
    default: [],
  })
  @Prop({
    type: [Types.ObjectId],
    ref: 'ProductSizes',
    default: [],
  })
  sizes?: Types.ObjectId[];

  @ApiProperty({
    description: 'Массив ID категорий продукта (MongoDB ObjectIds)',
    isArray: true,
    required: false,
    default: [],
  })
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
