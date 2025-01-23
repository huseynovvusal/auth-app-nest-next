import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  API_VERSION: Joi.string().default('1.0.0'),
  // Database
  DB_PORT: Joi.number().default(5432),
  DB_HOST: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_AUTO_LOAD_ENTITIES: Joi.boolean().required(),
  DB_SYNC: Joi.boolean().required(),
  // OAtuh
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_AUDIENCE: Joi.string().required(),
  JWT_ISSUER: Joi.string().required(),
  JWT_ACCESS_TOKEN_TTL: Joi.string().required(),
  JWT_REFRESH_TOKEN_TTL: Joi.string().required(),
  // Session
  SESSION_TTL: Joi.number().required(),
});
