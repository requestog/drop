import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true, unique: true, type: String })
  name: string;

  @Prop({ default: true, type: Boolean, index: true })
  isActive?: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
