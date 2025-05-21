import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../../../common/interfaces/role.interface';
import { IUser } from '../interfaces/user.interface';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class User extends Document implements IUser {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
    required: true,
  })
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
  })
  email: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @ApiProperty({
    example: 'cool_nickname',
    description: 'Уникальное имя пользователя',
    required: true,
  })
  @Prop({ type: String, required: true, unique: true, trim: true })
  nickName: string;

  @ApiProperty({
    example: 'Иван',
    description: 'Имя пользователя',
    required: false,
  })
  @Prop({ type: String, trim: true })
  name?: string;

  @ApiProperty({
    example: [Role.CUSTOMER],
    description: 'Роли пользователя',
    enum: Role,
    default: [Role.CUSTOMER],
    required: true,
  })
  @Prop({
    type: [String],
    enum: Role,
    default: [Role.CUSTOMER],
    required: true,
  })
  roles: Role[];

  @ApiProperty({
    example: '+79991234567',
    description: 'Номер телефона',
    required: false,
  })
  @Prop({ type: String, trim: true })
  phone?: string;

  @ApiProperty({
    example: false,
    description: 'Подтвержден ли email',
    default: false,
  })
  @Prop({ type: Boolean, default: false })
  emailVerified: boolean;

  @Prop({ type: String, default: undefined })
  confirmationToken?: string;

  @Prop({ type: Date, default: undefined })
  confirmationExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
