import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class CartItem extends Document {
  @ApiProperty({
    type: String,
    description: 'ID товара',
    example: '5f8d0f3d9d6b4a2f9c3e1d2a',
  })
  @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
  product: Types.ObjectId;

  @ApiProperty({
    description: 'Количество товара',
    example: 2,
    minimum: 1,
  })
  @Prop({ required: true, type: Number, minimum: 1 })
  quantity: number;

  @ApiProperty({
    type: String,
    description: 'ID размера товара',
    example: '5f8d0f3d9d6b4a2f9c3e1d2b',
  })
  @Prop({ required: true, type: Types.ObjectId, ref: 'ProductSizes' })
  size: Types.ObjectId;

  @ApiProperty({
    description: 'Цена товара',
    example: 1999.99,
    minimum: 0,
  })
  @Prop({ required: true, type: Number, minimum: 0 })
  price: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
