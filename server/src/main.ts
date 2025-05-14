import * as process from 'node:process';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe, Logger } from '@nestjs/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_CONFIG } from './modules/core/swagger/swagger.config';

async function start(): Promise<void> {
  const logger: Logger = new Logger('Server');
  const PORT: string | 3000 = process.env.PORT || 3000;
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule);

  const document: OpenAPIObject = SwaggerModule.createDocument(
    app,
    SWAGGER_CONFIG,
  );
  SwaggerModule.setup('api/docs', app, document);

  app.setGlobalPrefix('api');
  app.set('trust proxy', 1);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  try {
    await app.listen(PORT, (): void =>
      logger.log(`Server started on port ${PORT}`),
    );
  } catch (error) {
    logger.error(`Failed to start on port ${PORT}`, error.stack);
    process.exit(1);
  }
}

start();
