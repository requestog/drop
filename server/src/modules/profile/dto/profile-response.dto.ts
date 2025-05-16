import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Никнейм пользователя',
    example: 'cool_nickname',
  })
  nickname: string;

  @ApiProperty({
    description: 'Роли пользователя',
    example: ['user'],
    type: [String],
  })
  roles: string[];

  @ApiProperty({
    description: 'Подтвержден ли email',
    example: true,
  })
  emailVerified: boolean;
}
