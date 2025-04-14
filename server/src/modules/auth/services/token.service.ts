// src/auth/services/token.service.ts
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Session } from '../models/sessions.model';
import { Model, Types } from 'mongoose';
import * as ms from 'ms';
import { StringValue } from 'ms';
import { User } from '../../users/models/user.model';
import { AuthTokens } from '../interfaces/auth-tokens.interface';

export type SafeUser = Omit<User, 'passwordHash'> & { _id: Types.ObjectId };

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(Session.name) private sessionModel: Model<Session>,
  ) {}

  async generateTokens(user: SafeUser): Promise<AuthTokens> {
    const accessPayload = {
      username: user.email,
      sub: user._id.toString(),
      roles: user.roles,
    };
    const refreshPayload = {
      sub: user._id.toString(),
    };

    const accessSecret: string | undefined =
      this.configService.get<string>('JWT_ACCESS_SECRET');
    const accessExpiration: string | undefined = this.configService.get<string>(
      'JWT_ACCESS_EXPIRATION',
    );
    const refreshSecret: string | undefined =
      this.configService.get<string>('JWT_REFRESH_SECRET');
    const refreshExpiration: string | undefined =
      this.configService.get<string>('JWT_REFRESH_EXPIRATION');

    if (
      !accessSecret ||
      !accessExpiration ||
      !refreshSecret ||
      !refreshExpiration
    ) {
      console.error('JWT configuration is missing!');
      throw new InternalServerErrorException('Server configuration error');
    }

    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(accessPayload, {
          secret: accessSecret,
          expiresIn: accessExpiration,
        }),
        this.jwtService.signAsync(refreshPayload, {
          secret: refreshSecret,
          expiresIn: refreshExpiration,
        }),
      ]);

      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Error generating tokens:', error);
      throw new InternalServerErrorException('Could not generate tokens');
    }
  }

  async createOrUpdateSession(
    userId: Types.ObjectId,
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<Session> {
    const expiresAt: Date = this.calculateSessionExpirationDate();

    const newSession = new this.sessionModel({
      userId,
      token: refreshToken,
      expiresAt,
      userAgent,
      ipAddress,
    });
    try {
      return await newSession.save();
    } catch (error) {
      console.error('Error saving session:', error);
      throw new InternalServerErrorException('Could not save session');
    }
  }

  private calculateSessionExpirationDate(): Date {
    const refreshExpirationString: string | undefined =
      this.configService.get<string>('JWT_REFRESH_EXPIRATION');

    if (!refreshExpirationString) {
      throw new InternalServerErrorException(
        'Refresh token expiration (JWT_REFRESH_EXPIRATION) is not configured.',
      );
    }

    try {
      const expiresInMilliseconds: number = ms(
        refreshExpirationString as StringValue,
      );

      if (isNaN(expiresInMilliseconds)) {
        throw new Error('Invalid format for JWT_REFRESH_EXPIRATION');
      }

      return new Date(Date.now() + expiresInMilliseconds);
    } catch (error) {
      console.error(
        `Failed to parse JWT_REFRESH_EXPIRATION value: "${refreshExpirationString}"`,
        error,
      );
      throw new InternalServerErrorException(
        `Invalid format for JWT_REFRESH_EXPIRATION: "${refreshExpirationString}".
         Use formats like '7d', '2h', '30m'.`,
      );
    }
  }

  async issueTokensAndSaveSession(
    user: SafeUser,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<AuthTokens> {
    const tokens: AuthTokens = await this.generateTokens(user);
    await this.createOrUpdateSession(
      user._id,
      tokens.refreshToken,
      userAgent,
      ipAddress,
    );
    return tokens;
  }

  async validateRefreshToken(
    token: string,
  ): Promise<{ session: Session; payload: any }> {
    try {
      const refreshSecret: string | undefined =
        this.configService.get<string>('JWT_REFRESH_SECRET');
      if (!refreshSecret) {
        throw new InternalServerErrorException(
          'Refresh secret not configured.',
        );
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: refreshSecret,
      });

      const session = await this.sessionModel
        .findOne({ userId: new Types.ObjectId(payload.sub), token })
        .exec();

      if (!session) {
        throw new UnauthorizedException('Session not found or token mismatch.');
      }

      if (session.expiresAt < new Date()) {
        await this.sessionModel.deleteOne({ _id: session._id });
        throw new UnauthorizedException('Session expired.');
      }

      return { session, payload };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      console.error('Refresh token validation error:', error.message);
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }
  }

  async removeSession(sessionId: Types.ObjectId | string): Promise<void> {
    try {
      await this.sessionModel.deleteOne({ _id: sessionId });
    } catch (error) {
      console.error(`Error removing session ${sessionId}:`, error);
    }
  }
}
