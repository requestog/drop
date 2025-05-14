import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { FavoriteItem } from './favorite-item.model';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Favorites extends Document {
  @ApiProperty({
    type: String,
    description: 'ID пользователя',
    example: '507f1f77bcf86cd799439011',
  })
  @Prop({ required: true, unique: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @ApiProperty({
    type: () => [FavoriteItem],
    description: 'Список избранных товаров',
  })
  @Prop({ type: [FavoriteItem], default: [] })
  items: FavoriteItem[];
}

export const FavoritesSchema = SchemaFactory.createForClass(Favorites);
FavoritesSchema.set('toJSON', { virtuals: true });
FavoritesSchema.set('toObject', { virtuals: true });
