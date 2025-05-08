import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class CartItem extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
  product: Types.ObjectId;

  @Prop({ required: true, type: Number, minimum: 1 })
  quantity: number;

  @Prop({ required: true, type: Types.ObjectId, ref: 'ProductSizes' })
  size: Types.ObjectId;

  @Prop({ required: true, type: Number, minimum: 0 })
  price: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
