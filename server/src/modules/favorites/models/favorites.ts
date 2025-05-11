import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { FavoriteItem } from './favorite-item.model';

@Schema({ timestamps: true })
export class Favorites extends Document {
  @Prop({ required: true, unique: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: [FavoriteItem], default: [] })
  items: FavoriteItem[];
}

export const FavoritesSchema = SchemaFactory.createForClass(Favorites);
FavoritesSchema.set('toJSON', { virtuals: true });
FavoritesSchema.set('toObject', { virtuals: true });
