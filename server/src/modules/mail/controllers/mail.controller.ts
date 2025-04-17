import { Controller, Get, Param, Res } from '@nestjs/common';
import { MailService } from '../services/mail.service';
import { UsersService } from '../../users/services/users.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Get('activate/:confirmationToken')
  async confirmEmail(
    @Param('confirmationToken') confirmationToken: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.usersService.confirmEmailByToken(confirmationToken);
    res.redirect(`${this.configService.get<string>('CLIENT_URL')}`);
  }
}
