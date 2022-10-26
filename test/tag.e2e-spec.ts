import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TagModule } from '../src/modules/tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testingDbConfig } from './testing-db-config';

describe('TagController (e2e)', () => {
  let app: INestApplication;
  const route = '/tags';
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(testingDbConfig), TagModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it(`${route} (GET)`, () => {
    return request(app.getHttpServer()).get(route).expect(200).expect([]);
  });
});
