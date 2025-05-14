import { ApiProperty } from '@nestjs/swagger';

export class RegistrationResponseDto {
  @ApiProperty({ description: 'Токен доступа' })
  accessToken: string;
}
