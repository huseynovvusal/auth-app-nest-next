import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'stagging')
    .required(),
  DB_PORT: Joi.number().required().default(5432),
  DB_HOST: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_AUTO_LOAD_ENTITIES: Joi.boolean().required(),
  DB_SYNC: Joi.boolean().required(),
});
