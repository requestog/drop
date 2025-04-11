import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Request } from 'express';
import { LoginDto } from '../dto/login.dto';
import { AuthTokens } from '../interfaces/auth-tokens.interface';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() loginDto: LoginDto, @Req() req: Request): Promise<AuthTokens> {
    const userAgent: string | undefined = req.headers['user-agent'];
    const ipAddress: string | undefined = req.ip;

    return this.authService.login(loginDto, userAgent, ipAddress);
  }

  @Post('/registration')
  registration(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
  ): Promise<AuthTokens> {
    const userAgent: string | undefined = req.headers['user-agent'];
    const ipAddress: string | undefined = req.ip;

    return this.authService.registration(loginDto, userAgent, ipAddress);
  }

  @Post('/refresh')
  refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Req() req: Request,
  ): Promise<AuthTokens> {
    const userAgent: string | undefined = req.headers['user-agent'];
    const ipAddress: string | undefined = req.ip;
    return this.authService.refreshToken(refreshTokenDto, userAgent, ipAddress);
  }
}
