import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class FavoriteItem extends Document {
  @ApiProperty({
    type: String,
    description: 'ID товара',
    example: '5f8d0f3d9d6b4a2f9c3e1d2a',
  })
  @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
  product: Types.ObjectId;

  @ApiProperty({
    type: String,
    description: 'ID размера товара',
    example: '5f8d0f3d9d6b4a2f9c3e1d2b',
  })
  @Prop({ required: true, type: Types.ObjectId, ref: 'ProductSizes' })
  size: Types.ObjectId;
}

export const FavoriteItemSchema = SchemaFactory.createForClass(FavoriteItem);
