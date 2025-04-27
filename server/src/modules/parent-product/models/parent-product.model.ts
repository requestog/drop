import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ParentProduct extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Number, default: 0, minimum: 0, maximum: 5 })
  averageRating?: number;

  @Prop({ type: Number, default: 0, minimum: 0 })
  reviewCount?: number;

  @Prop({
    type: [Types.ObjectId],
    ref: 'Review',
    default: [],
  })
  reviews: Types.ObjectId[];
}

export const ParentProductSchema = SchemaFactory.createForClass(ParentProduct);
