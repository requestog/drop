import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh токен из cookie',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
