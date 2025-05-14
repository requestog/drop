import { ApiProperty } from '@nestjs/swagger';

export class RefreshResponseDto {
  @ApiProperty({ description: 'Новый токен доступа' })
  accessToken: string;
}
