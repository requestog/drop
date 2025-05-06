import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ timestamps: true })
export class Favorites extends Document {
  @Prop({ ref: 'User', type: Types.ObjectId, required: true })
  user: Types.ObjectId;

  @Prop({ ref: 'Product', type: [Types.ObjectId] })
  products: Types.ObjectId[];
}

export const FavoritesSchema = SchemaFactory.createForClass(Favorites);
