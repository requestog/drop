import { Document, Types } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { OrderItem } from './order-item.model';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Order extends Document {
  @ApiProperty({ description: 'ID пользователя (MongoDB ObjectId)' })
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  user: Types.ObjectId;

  @ApiProperty({
    description: 'Статус заказа',
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  })
  @Prop({
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @ApiProperty({ description: 'Общая сумма заказа' })
  @Prop({ type: Number, required: true })
  total: number;

  @ApiProperty({ description: 'Массив элементов заказа', type: [String] }) // Указываем String, т.к. это ссылки на OrderItem
  @Prop({ type: [Types.ObjectId], ref: 'OrderItem' })
  items: OrderItem[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
