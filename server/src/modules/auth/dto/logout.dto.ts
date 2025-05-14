import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class LogoutDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID сессии для выхода',
    required: true,
  })
  @IsMongoId({ message: 'Не валидный ID сессии' })
  @IsNotEmpty({ message: 'ID сессии не может быть пустым' })
  readonly sessionId: string;
}
