import { DocumentBuilder } from '@nestjs/swagger';
import { SWAGGER_DESC } from './swagger.desc';

export const SWAGGER_CONFIG = new DocumentBuilder()
  .setTitle('DROP STORE API')
  .setDescription(SWAGGER_DESC)
  .setVersion('1.0')
  .addCookieAuth('refreshToken', {
    type: 'apiKey',
    in: 'cookie',
  })
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
    'access-token',
  )
  .build();
