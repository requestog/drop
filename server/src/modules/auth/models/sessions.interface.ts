import { User } from '../../users/models/user.model';
import { Schema as MongooseSchema } from 'mongoose';

export interface ISession {
  userId: User | MongooseSchema.Types.ObjectId;
  token: string;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
}
