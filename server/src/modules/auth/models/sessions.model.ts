import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Document } from 'mongoose';
import { User } from '../../users/models/user.model';
import { ISession } from './sessions.interface';

@Schema({ timestamps: true })
export class Session extends Document implements ISession {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId: User | MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  token: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop()
  userAgent?: string;

  @Prop()
  ipAddress?: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
