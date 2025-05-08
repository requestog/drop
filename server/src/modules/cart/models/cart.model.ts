import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CartItem } from './cart-item.model';

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ required: true, unique: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: [CartItem], default: undefined })
  items?: CartItem[];

  @Prop({
    virtual: true,
    default: 0,
    min: 0,
    get: function (): number {
      return this.items.reduce(
        (sum: number, item: CartItem): number =>
          sum + item.price * item.quantity,
        0,
      );
    },
  })
  total?: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
CartSchema.set('toJSON', { virtuals: true });
CartSchema.set('toObject', { virtuals: true });
