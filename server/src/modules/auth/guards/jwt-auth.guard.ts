import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

import { ConfigService } from '@nestjs/config'; // Добавь импорт

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger: Logger = new Logger('JwtAuthGuard');

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        this.logger.error('Authorization header missing or malformed');
        throw new UnauthorizedException({
          message: 'Authorization header missing or malformed',
        });
      }

      const token = authHeader.split(' ')[1];

      const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
      if (!accessSecret) {
        this.logger.error('JWT_ACCESS_SECRET is not configured.');
        throw new InternalServerErrorException('Server configuration error');
      }

      const user = this.jwtService.verify(token, { secret: accessSecret });

      if (!user) {
        this.logger.error('JWT verification returned undefined user.');
        throw new UnauthorizedException('Invalid token payload.');
      }

      req.user = user;

      return true;
    } catch (error) {
      this.logger.error(
        `JwtAuthGuard Unauthorized: ${error.message}`,
        error.stack,
      );
      throw new UnauthorizedException({
        message: 'User is not authorized: ' + error.message,
      });
    }
  }
}
