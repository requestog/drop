import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Request, Response } from 'express';
import { LoginDto } from '../dto/login.dto';
import { AuthTokens } from '../interfaces/auth-tokens.interface';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { CookieService } from '../services/cookie.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const userAgent: string | undefined = req.headers['user-agent'];
    const ipAddress: string | undefined = req.ip;
    const tokens: AuthTokens = await this.authService.registration(
      loginDto,
      userAgent,
      ipAddress,
    );
    this.cookieService.setRefreshToken(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Post('/registration')
  async registration(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const userAgent: string | undefined = req.headers['user-agent'];
    const ipAddress: string | undefined = req.ip;
    const tokens: AuthTokens = await this.authService.registration(
      loginDto,
      userAgent,
      ipAddress,
    );

    this.cookieService.setRefreshToken(res, tokens.refreshToken);
    res.status(HttpStatus.CREATED);

    return { accessToken: tokens.accessToken };
  }

  @Post('/refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const refreshTokenFromCookie: RefreshTokenDto = req.cookies?.refreshToken;
    if (!refreshTokenFromCookie) {
      throw new UnauthorizedException('Refresh token not found in cookie.');
    }
    const userAgent: string | undefined = req.headers['user-agent'];
    const ipAddress: string | undefined = req.ip;
    const tokens: AuthTokens = await this.authService.refreshToken(
      refreshTokenFromCookie,
      userAgent,
      ipAddress,
    );

    this.cookieService.setRefreshToken(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }
}
