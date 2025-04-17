import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendUserConfirmation(
    email: string,
    confirmationToken: string,
  ): Promise<void> {
    const url: string = `${this.configService.get<string>('API_URL')}/api/mail/activate/${confirmationToken}`;

    try {
      await this.mailService.sendMail({
        to: email,
        subject: 'Подтверждение почты',
        template: './confirmation/email.html',
        context: {
          url,
          email,
        },
      });
    } catch (error) {
      console.log('Invalid email service: \n', error);
    }
  }
}
