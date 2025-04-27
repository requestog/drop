import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../enums/role.enum';
import { IUser } from '../interfaces/user.interface';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document implements IUser {
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
  })
  email: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({ type: String, required: true, unique: true, trim: true })
  nickName: string;

  @Prop({ type: String, trim: true })
  name?: string;

  @Prop({ type: String, trim: true })
  surname?: string;

  @Prop({ type: String, trim: true })
  patronymic?: string;

  @Prop({ type: [String], enum: Role, default: [Role.User], required: true })
  roles: Role[];

  @Prop({ type: String, trim: true })
  phone?: string;

  @Prop({ type: String })
  avatarUrl?: string;

  @Prop({ type: Boolean, default: false })
  emailVerified: boolean;

  @Prop({ type: String, default: undefined })
  confirmationToken?: string;

  @Prop({ type: Date, default: undefined })
  confirmationExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ nickName: 1 }, { unique: true });
