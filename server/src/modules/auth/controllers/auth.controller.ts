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
import { TokenService } from '../services/token.service';
import { LogoutDto } from '../dto/logout.dto';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginResponseDto } from '../dto/login-response.dto';
import { RegistrationResponseDto } from '../dto/registration-response.dto';
import { RefreshResponseDto } from '../dto/refresh-response.dto';
import { LogoutResponseDto } from '../dto/logout-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
    private readonly refreshService: TokenService,
  ) {}

  @Post('/login')
  @ApiOperation({ summary: 'Вход в систему' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Успешный вход',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Неверные учетные данные',
  })
  @ApiBody({ type: LoginDto })
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const userAgent: string | undefined = req.headers['user-agent'];
    const ipAddress: string | undefined = req.ip;
    const tokens: AuthTokens = await this.authService.login(
      loginDto,
      userAgent,
      ipAddress,
    );
    this.cookieService.setRefreshToken(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Post('/registration')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Пользователь успешно зарегистрирован',
    type: RegistrationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Невалидные данные или email уже занят',
  })
  @ApiBody({ type: LoginDto })
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

  @Post('/logout')
  @ApiOperation({ summary: 'Выход из системы' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Успешный выход',
    type: LogoutResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Невалидный ID сессии',
  })
  @ApiCookieAuth('refreshToken')
  @ApiBody({ type: LogoutDto })
  async logout(
    @Body() logoutDto: LogoutDto,
    @Res({ passthrough: true })
    res: Response,
  ): Promise<void> {
    this.cookieService.clearRefreshToken(res);

    await this.refreshService.removeSession(logoutDto.sessionId);
    res.status(HttpStatus.OK).send({ message: 'Logged out successfully' });
  }

  @Post('/refresh')
  @ApiOperation({ summary: 'Обновление токена доступа' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Токен успешно обновлен',
    type: RefreshResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Невалидный refresh токен',
  })
  @ApiCookieAuth('refreshToken')
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
