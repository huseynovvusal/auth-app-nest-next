import { registerAs } from '@nestjs/config';
import ms from 'ms';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  audience: process.env.JWT_AUDIENCE,
  issuer: process.env.JWT_ISSUER,
  accessTokenTtl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL || '600', 10),
  refreshTokenTtl: parseInt(process.env.JWT_REFRESH_TOKEN_TTL || '3600', 10),
  sessionTtl: parseInt(process.env.SESSION_TTL || '3600000', 10),
}));