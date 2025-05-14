import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Category extends Document {
  @ApiProperty({ description: 'Название категории' })
  @Prop({ required: true, unique: true, type: String })
  name: string;

  @ApiPropertyOptional({ description: 'Активна ли категория', default: true })
  @Prop({ default: true, type: Boolean, index: true })
  isActive?: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
