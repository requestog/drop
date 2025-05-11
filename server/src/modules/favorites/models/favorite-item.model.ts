import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ timestamps: true })
export class FavoriteItem extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
  product: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'ProductSizes' })
  size: Types.ObjectId;
}

export const FavoriteItemSchema = SchemaFactory.createForClass(FavoriteItem);
