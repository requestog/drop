import { Role } from '../enums/role.enum';
import { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  nickName: string;
  name?: string;
  surname?: string;
  patronymic?: string;
  roles: Role[];
  phone?: string;
  avatarUrl?: string;
  emailVerified: boolean;
  confirmationToken?: string;
  confirmationExpires?: Date;
}
