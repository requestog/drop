import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../common/interfaces/role.interface';

export class SafeUser {
  @ApiProperty({ type: String, description: 'ID пользователя' })
  _id: Types.ObjectId;

  @ApiProperty()
  email: string;

  @ApiProperty()
  nickName: string;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  surname?: string;

  @ApiProperty({ required: false })
  patronymic?: string;

  @ApiProperty({ enum: Role })
  roles: Role[];

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  avatarUrl?: string;

  @ApiProperty()
  emailVerified: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
