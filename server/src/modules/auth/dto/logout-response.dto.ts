import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty({ description: 'Сообщение об успешном выходе' })
  message: string;
}
