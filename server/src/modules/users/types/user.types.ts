import { Types } from 'mongoose';
import { User } from '../models/user.model';

export type SafeUser = Omit<
  User,
  'passwordHash' | 'confirmationToken' | 'confirmationExpires'
> & {
  _id: Types.ObjectId;
};
