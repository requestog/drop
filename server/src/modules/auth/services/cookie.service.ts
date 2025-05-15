import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as ms from 'ms';
import { StringValue } from 'ms';

@Injectable()
export class CookieService {
  constructor(private configService: ConfigService) {}

  private readonly logger: Logger = new Logger('CookieService');

  setRefreshToken(res: Response, token: string): void {
    try {
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
    } catch (error) {
      this.logger.error(
        `Failed to set refresh token: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error setting refresh token');
    }
  }

  clearRefreshToken(res: Response): void {
    try {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production',
        sameSite: 'strict',
        path: '/auth',
      });
    } catch (error) {
      this.logger.error(
        `Failed to clear refresh token: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error clear refresh token');
    }
  }
}
