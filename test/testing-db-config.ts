import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const testingDbConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: ':memory:',
  logging: false,
  synchronize: true,
  autoLoadEntities: true,
};
