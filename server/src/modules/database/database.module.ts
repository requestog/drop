import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './services/database.service';
import { ConfigModule } from '@nestjs/config';
import * as process from 'node:process';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      useFactory: async (): Promise<{ uri: string }> => ({
        uri: `${process.env.MONGODB_URL}`,
      }),
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
