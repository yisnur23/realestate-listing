import Joi from 'joi';

export const configSchema = Joi.object({
  DB_HOST: Joi.required(),
  DB_PASSWORD: Joi.string().allow(''),
  DB_USERNAME: Joi.required(),
  DB_DATABASE_NAME: Joi.required(),
  DB_PORT: Joi.number().default(5432),
  SERVER_PORT: Joi.number().required(),
  NODE_ENV: Joi.string().default('development'),
});
