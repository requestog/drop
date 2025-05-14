import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class OrderItem extends Document {
  @ApiProperty({ description: 'ID продукта (MongoDB ObjectId)' })
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  @ApiProperty({ description: 'ID размера продукта (MongoDB ObjectId)' })
  @Prop({ type: Types.ObjectId, ref: 'ProductSizes', required: true })
  size: Types.ObjectId;

  @ApiProperty({ description: 'Количество товара в заказе' })
  @Prop({ type: Number, default: 1, min: 1 })
  count: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
