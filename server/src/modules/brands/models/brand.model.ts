import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Brand extends Document {
  @ApiProperty({ description: 'Название бренда' })
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty({ description: 'URL-адрес логотипа бренда (опционально)' })
  @Prop({ type: String })
  image?: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
