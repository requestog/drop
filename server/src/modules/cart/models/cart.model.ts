import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CartItem } from './cart-item.model';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Cart extends Document {
  @ApiProperty({
    type: String,
    description: 'ID пользователя',
    example: '507f1f77bcf86cd799439011',
  })
  @Prop({ required: true, unique: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @ApiProperty({
    type: () => [CartItem],
    description: 'Список товаров в корзине',
  })
  @Prop({ type: [CartItem], default: [] })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.set('toJSON', { virtuals: true });
CartSchema.set('toObject', { virtuals: true });
