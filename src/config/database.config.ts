import { registerAs } from '@nestjs/config';
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
