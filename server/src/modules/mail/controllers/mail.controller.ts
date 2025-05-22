import { Controller, Get, Param, Res } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Get('activate/:confirmationToken')
  @ApiOperation({
    summary: 'Подтверждение email',
    description:
      'Активация email пользователя по токену подтверждения. После успешной активации происходит редирект на клиентскую часть.',
  })
  @ApiParam({
    name: 'confirmationToken',
    description: 'Токен подтверждения email',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  @ApiResponse({
    status: 302,
    description: 'Редирект на клиент после подтверждения',
    headers: {
      Location: {
        description: 'URL для редиректа',
        example: 'https://client.com/email-confirmed',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Невалидный токен подтверждения',
  })
  @ApiResponse({
    status: 404,
    description: 'Токен не найден или истек',
  })
  async confirmEmail(
    @Param('confirmationToken') confirmationToken: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.usersService.confirmEmail(confirmationToken);
    res.redirect(`${this.configService.get<string>('CLIENT_URL')}`);
  }
}
