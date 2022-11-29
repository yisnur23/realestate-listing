import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const testingDbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'db',
  synchronize: true,
  logging: false,
  autoLoadEntities: true,
};
