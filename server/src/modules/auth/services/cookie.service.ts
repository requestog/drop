import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as ms from 'ms';
import { StringValue } from 'ms';

@Injectable()
export class CookieService {
  constructor(private configService: ConfigService) {}

  setRefreshToken(res: Response, token: string): void {
    const timeStringSetting: string | undefined =
      this.configService.get<string>('JWT_REFRESH_EXPIRATION');
    const refreshExpirationMs: number = ms(timeStringSetting as StringValue);

    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      path: '/auth',
      maxAge: refreshExpirationMs,
    });
  }

  clearRefreshToken(res: Response): void {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      path: '/auth',
    });
  }
}
