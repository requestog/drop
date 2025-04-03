import * as process from 'node:process';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function start(): Promise<void> {
  const PORT: string | 3000 = process.env.PORT || 3000;
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

start();
