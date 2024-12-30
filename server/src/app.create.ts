import { INestApplication, ValidationPipe } from '@nestjs/common';

import * as cookieParser from 'cookie-parser';

export function appCreate(app: INestApplication): void {
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

  app.enableCors({
    origin: process.env.APP_ORIGIN,
    credentials: true,
  });

  app.use(cookieParser());
}
