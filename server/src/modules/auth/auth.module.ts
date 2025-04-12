import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { Session, SessionSchema } from './models/sessions.model';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TokenService } from './services/token.service';
import { CookieService } from './services/cookie.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, TokenService, CookieService],
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const accessSecret: string | undefined =
          configService.get<string>('JWT_ACCESS_SECRET');
        const accessExpiration: string | undefined = configService.get<string>(
          'JWT_ACCESS_EXPIRATION',
        );

        if (!accessSecret || !accessExpiration) {
          throw new Error(
            'JWT Access Secret or Expiration is missing in environment variables!',
          );
        }

        return {
          secret: accessSecret,
          signOptions: {
            expiresIn: accessExpiration,
          },
        };
      },
    }),

    forwardRef(() => UsersModule),
  ],
  exports: [AuthService, TokenService, JwtModule, PassportModule],
})
export class AuthModule {}
