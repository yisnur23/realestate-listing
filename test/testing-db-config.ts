import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const testingDbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'username',
  password: 'password',
  database: 'db',
  synchronize: true,
  logging: false,
  autoLoadEntities: true,
  entities: [],
};
