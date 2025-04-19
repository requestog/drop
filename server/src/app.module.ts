import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as process from 'node:process';
import { DatabaseModule } from './modules/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    MailModule,
    ProductsModule,
  ],
})
export class AppModule {}
