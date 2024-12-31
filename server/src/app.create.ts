import { INestApplication, ValidationPipe } from '@nestjs/common';

import * as cookieParser from 'cookie-parser';
import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';

export function appCreate(app: INestApplication): void {
  //? Set the global prefix
  app.setGlobalPrefix('api');

  //? Set the global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  //? Enable CORS
  app.enableCors({
    origin: process.env.APP_ORIGIN,
    credentials: true,
  });

  //? Enable cookie parser
  app.use(cookieParser());
}
