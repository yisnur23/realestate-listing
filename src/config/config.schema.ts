import Joi from 'joi';

export const configSchema = Joi.object({
  DB_HOST: Joi.required(),
  DB_PASSWORD: Joi.string().allow(''),
  DB_USERNAME: Joi.string().required(),
  DB_DATABASE_NAME: Joi.required(),
  DB_PORT: Joi.number().default(5432),
  SERVER_PORT: Joi.number().required(),
  NODE_ENV: Joi.string().default('development'),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_REDIRECT_URL: Joi.string().required(),
  GOOGLE_ROOT_URL: Joi.string().required(),
  SERVER_URL: Joi.string().required(),
  SESSION_SECRET: Joi.string().required(),
});
