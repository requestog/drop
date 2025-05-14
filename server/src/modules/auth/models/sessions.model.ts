import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Document } from 'mongoose';
import { User } from '../../users/models/user.model';
import { ISession } from './sessions.interface';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Session extends Document implements ISession {
  @ApiProperty({
    type: String,
    description: 'ID пользователя',
  })
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId: User | MongooseSchema.Types.ObjectId;

  @ApiProperty({
    description: 'Refresh токен сессии',
  })
  @Prop({
    type: String,
    required: true,
    index: true,
  })
  token: string;

  @ApiProperty({
    description: 'Дата истечения токена',
  })
  @Prop({ required: true })
  expiresAt: Date;

  @ApiProperty({
    description: 'User-Agent устройства',
    required: false,
  })
  @Prop()
  userAgent?: string;

  @ApiProperty({
    description: 'IP адрес устройства',
    required: false,
  })
  @Prop()
  ipAddress?: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
