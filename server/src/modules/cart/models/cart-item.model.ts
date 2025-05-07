import { Prop, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class CartItem extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
  product: Types.ObjectId;

  @Prop({ required: true, type: Number, minimum: 1 })
  quantity: number;

  @Prop({ required: true, type: String })
  size: string;

  @Prop({ required: true, type: Number, minimum: 0 })
  price: number;
}
