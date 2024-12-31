import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  environment: process.env.NODE_ENV || 'procuction',
  apiVersion: process.env.API_VERSION || '1.0.0',
}));
