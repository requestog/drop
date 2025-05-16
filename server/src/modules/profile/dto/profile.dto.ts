import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван Иванов',
    required: true,
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Номер телефона пользователя',
    example: '+79991234567',
    required: true,
    type: String,
  })
  @IsString()
  phone: string;
}
