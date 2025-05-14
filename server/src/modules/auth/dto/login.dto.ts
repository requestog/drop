import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
    required: true,
  })
  @IsEmail({}, { message: 'Пожалуйста, введите корректный email адрес' })
  @IsNotEmpty({ message: 'Email не может быть пустым' })
  @MaxLength(255, { message: 'Email слишком длинный' })
  readonly email: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description: 'Пароль (мин. 8 символов, 1 заглавная, 1 цифра)',
    required: true,
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  @MinLength(8, { message: 'Пароль должен быть не менее 8 символов' })
  @MaxLength(255, { message: 'Пароль должен быть не более 255 символов' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\S]{8,}$/, {
    message: 'Пароль должен содержать минимум 8 символов...',
  })
  readonly password: string;
}
