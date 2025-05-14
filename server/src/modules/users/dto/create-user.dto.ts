import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
    required: true,
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'strongPassword123!',
    description: 'Пароль (минимум 8 символов)',
    minLength: 8,
    required: true,
  })
  @IsString()
  readonly password: string;
}
