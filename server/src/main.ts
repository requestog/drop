import * as process from 'node:process';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function start(): Promise<void> {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

start();
