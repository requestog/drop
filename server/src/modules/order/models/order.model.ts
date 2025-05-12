import { Document, Types } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { OrderItem } from './order-item.model';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  user: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Prop({ type: Number, required: true })
  total: number;

  @Prop({ type: [Types.ObjectId], ref: 'OrderItem' })
  items: OrderItem[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
