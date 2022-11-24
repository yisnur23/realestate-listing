import { registerAs } from '@nestjs/config';
import { SessionOptions } from 'express-session';
import { DataSourceOptions } from 'typeorm';

export const database = registerAs('database', (): DataSourceOptions => {
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    synchronize: process.env.NODE_ENV === 'development',
    logging: false,
    entities: [],
  };
});

export type GoogleConfig = {
  clientId: string;
  clientSecret: string;
  redirectUrl: string;

  rootUrl: string;
};
export type AWSConfig = {
  region: string;
  bucketName: string;
  accessId: string;
  accessKey: string;
};
export const google = registerAs(
  'google',
  (): GoogleConfig => ({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUrl: process.env.SERVER_URL + process.env.GOOGLE_REDIRECT_URL,
    rootUrl: process.env.GOOGLE_ROOT_URL,
  }),
);

export type AppConfig = {
  sessionSecret: string;
  nodeEnv: string;
};

export const app = registerAs(
  'app',
  (): AppConfig => ({
    sessionSecret: process.env.SESSION_SECRET,
    nodeEnv: process.env.NODE_ENV,
  }),
);
export const aws = registerAs(
  'aws',
  (): AWSConfig => ({
    region: process.env.S3_REGION,
    bucketName: process.env.S3_BUCKET_NAME,
    accessId: process.env.S3_ACCESS_KEY_ID,
    accessKey: process.env.S3_SECRET_ACCESS_KEY,
  }),
);
export const session = registerAs(
  'session',
  (): SessionOptions => ({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: false,
      httpOnly: false,
    },
  }),
);
