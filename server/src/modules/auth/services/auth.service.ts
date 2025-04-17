import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { User } from '../../users/models/user.model';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';
import { TokenService } from './token.service';
import { AuthTokens } from '../interfaces/auth-tokens.interface';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { MailService } from '../../mail/services/mail.service';
import { v4 as uuidv4 } from 'uuid';
import { SafeUser } from '../../users/types/user.types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private tokenService: TokenService,
    private mailService: MailService,
  ) {}

  async login(
    loginDto: LoginDto,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<AuthTokens> {
    const user: SafeUser = await this.validateUserCredentials(loginDto);
    return this.tokenService.issueTokensAndSaveSession(
      user,
      userAgent,
      ipAddress,
    );
  }

  async registration(
    loginDto: LoginDto,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<AuthTokens> {
    const candidate: User | null = await this.userService.getUserByEmail(
      loginDto.email,
    );
    if (candidate) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const confirmationToken: string = uuidv4();
    const confirmationExpires = new Date();
    confirmationExpires.setHours(confirmationExpires.getHours() + 24);

    const createdUser: SafeUser = await this.userService.createUser(
      loginDto,
      confirmationToken,
      confirmationExpires,
    );

    if (!createdUser || !createdUser._id) {
      throw new InternalServerErrorException(
        'Failed to create user or user missing ID.',
      );
    }

    await this.mailService.sendUserConfirmation(
      loginDto.email,
      confirmationToken,
    );

    return this.tokenService.issueTokensAndSaveSession(
      createdUser,
      userAgent,
      ipAddress,
    );
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<AuthTokens> {
    try {
      const { session, payload } = await this.tokenService.validateRefreshToken(
        refreshTokenDto.refreshToken,
      );

      const userEmail: string = payload.email;
      const user: User | null =
        await this.userService.getUserByEmail(userEmail);

      if (!user) {
        await this.tokenService.removeSession(session.id);
        throw new UnauthorizedException(
          'User associated with token not found.',
        );
      }
      await this.tokenService.removeSession(session.id);
      const safeUser: SafeUser = this.userService.toSafeUser(user);
      return this.tokenService.issueTokensAndSaveSession(
        safeUser,
        userAgent,
        ipAddress,
      );
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Error during token refresh:', error);
      throw new InternalServerErrorException('Could not refresh token.');
    }
  }

  private async validateUserCredentials(loginDto: LoginDto): Promise<SafeUser> {
    const user: User | null = await this.userService.getUserByEmail(
      loginDto.email,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching: boolean = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.userService.toSafeUser(user);
  }
}
