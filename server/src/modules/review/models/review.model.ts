import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Document } from 'mongoose';
import { User } from '../../users/models/user.model';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Review extends Document {
  @ApiProperty({
    description: 'ID родительского продукта (MongoDB ObjectId)',
    type: String,
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'ParentProduct',
    required: true,
    index: true,
  })
  parentProductId: Types.ObjectId;

  @ApiProperty({ description: 'ID продукта (MongoDB ObjectId)', type: String })
  @Prop({
    type: Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true,
  })
  productId: Types.ObjectId;

  @ApiProperty({
    description: 'ID пользователя, оставившего отзыв (MongoDB ObjectId)',
    type: String,
  })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: Types.ObjectId | User;

  @ApiProperty({ description: 'Рейтинг продукта (от 1 до 5)' })
  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @ApiProperty({ description: 'Комментарий к отзыву (опционально)' })
  @Prop()
  comment?: string;

  @ApiProperty({
    description: 'URL-адреса изображений к отзыву (опционально)',
    isArray: true,
    required: false,
  })
  @Prop({ type: [String] })
  images?: string[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
