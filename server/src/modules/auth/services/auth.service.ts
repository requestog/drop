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
import { TokenService, SafeUser } from './token.service';
import { AuthTokens } from '../interfaces/auth-tokens.interface';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private tokenService: TokenService,
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

    const createdUser: User = await this.userService.createUser(loginDto);
    if (!createdUser || !createdUser._id) {
      throw new InternalServerErrorException(
        'Failed to create user or user missing ID.',
      );
    }

    const { passwordHash, ...userWithoutPassword } = Object(createdUser);

    const safeUser: SafeUser = {
      ...userWithoutPassword,
      _id: createdUser._id,
    };

    return this.tokenService.issueTokensAndSaveSession(
      safeUser,
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
      const userId: Types.ObjectId = new Types.ObjectId(payload._id);
      const user: User | null = await this.userService.getUserById(userId);
      if (!user) {
        await this.tokenService.removeSession(session.id);
        throw new UnauthorizedException(
          'User associated with token not found.',
        );
      }
      await this.tokenService.removeSession(session.id);
      const { passwordHash, ...userWithoutPassword } = Object(user.toObject());
      const safeUser: SafeUser = {
        ...userWithoutPassword,
        _id: user._id,
      };
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

    const { passwordHash, ...userWithoutPassword } = Object(user);
    const safeUser: SafeUser = {
      ...userWithoutPassword,
      _id: user._id,
    };

    return safeUser;
  }
}
