import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../../../common/interfaces/role.interface';
import { ApiProperty } from '@nestjs/swagger';

export class AddRoleDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID пользователя',
  })
  @IsString({ message: `ID должен быть строкой` })
  @IsNotEmpty({ message: `ID не должен быть пустой` })
  user: string;

  @ApiProperty({
    enum: Object.values(Role),
    example: Role.ADMIN,
    description: 'Роль из предопределенного списка',
  })
  @IsEnum(Role, {
    message: `Роль должна быть одним из: ${Object.values(Role).join(', ')}`,
  })
  @IsNotEmpty({ message: `Роль не должна быть пустой` })
  role: Role;
}
