import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class ParentProduct extends Document {
  @ApiProperty({ description: 'Название родительской категории продукта' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'Средний рейтинг продуктов в этой категории (от 0 до 5)',
    default: 0,
    minimum: 0,
    maximum: 5,
  })
  @Prop({ type: Number, default: 0, minimum: 0, maximum: 5 })
  averageRating?: number;

  @ApiProperty({
    description: 'Количество отзывов к продуктам в этой категории',
    default: 0,
    minimum: 0,
  })
  @Prop({ type: Number, default: 0, minimum: 0 })
  reviewCount?: number;

  @ApiProperty({
    description: 'Массив ID отзывов (MongoDB ObjectIds)',
    isArray: true,
    required: false,
    default: [],
  })
  @Prop({
    type: [Types.ObjectId],
    ref: 'Review',
    default: [],
  })
  reviews: Types.ObjectId[];

  @ApiProperty({
    description: 'Массив ID продуктов (MongoDB ObjectIds)',
    isArray: true,
    required: false,
    default: [],
  })
  @Prop({
    type: [Types.ObjectId],
    ref: 'Product',
    default: [],
  })
  products: Types.ObjectId[];

  @ApiProperty({ description: 'ID бренда (MongoDB ObjectId)' })
  @Prop({ type: Types.ObjectId, ref: 'Brand', default: null })
  brand: Types.ObjectId;
}

export const ParentProductSchema = SchemaFactory.createForClass(ParentProduct);
