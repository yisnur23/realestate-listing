import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testingDbConfig } from '../testing-db-config';
import crypto from 'crypto';
import { AddressModule } from '../../src/modules/address/address.module';
import { RouterModule } from '@nestjs/core';
import { AddressRoutes } from '../../src/modules/address/address.routes';
import { WoredaRepository } from '../../src/modules/address/woreda/woreda.repository';
import { NeighbourhoodRepository } from '../../src/modules/address/neighbourhood/neighbourhood.repository';

describe('CityController (e2e)', () => {
  let app: INestApplication;
  let woredaRepository: WoredaRepository;
  let neighbourhoodRepository: NeighbourhoodRepository;
  const route = '/address/neighbourhoods';
  const id = crypto.randomUUID();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(testingDbConfig),
        AddressModule,
        RouterModule.register(AddressRoutes),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    woredaRepository = moduleFixture.get<WoredaRepository>(WoredaRepository);
    neighbourhoodRepository = moduleFixture.get<NeighbourhoodRepository>(
      NeighbourhoodRepository,
    );
    await app.init();
  });

  describe(`${route} (POST)`, () => {
    it('creates a neigbourhod', async () => {
      const woreda = await woredaRepository.save({
        name: 'state_name',
      });
      const response = await request(app.getHttpServer()).post(route).send({
        name: 'name',
        woreda_id: woreda.id,
      });

      expect(response.statusCode).toBe(201);
    });
  });
  describe(`${route} (GET)`, () => {
    it('returns an array of neighbourhoods', async () => {
      const nh = await neighbourhoodRepository.save({
        name: 'name',
      });
      const response = await request(app.getHttpServer()).get(route);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([
        {
          id: nh.id,
          name: nh.name,
        },
      ]);
    });
  });
  describe(`${route}/:id (GET)`, () => {
    it('returns a neighbourhood', async () => {
      const nh = await neighbourhoodRepository.save({
        name: 'name',
      });

      const response = await request(app.getHttpServer()).get(
        `${route}/${nh.id}`,
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: nh.id,
        name: nh.name,
      });
    });
    it('returns a not found error if neighbourhood does not exist', async () => {
      const response = await request(app.getHttpServer()).get(`${route}/${id}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe(
        `neighbourhood with id ${id} not found`,
      );
    });
  });

  describe(`${route}/:id (PATCH)`, () => {
    it('updates a neighbourhood', async () => {
      const nh = await neighbourhoodRepository.save({
        name: 'name',
      });
      const response = await request(app.getHttpServer())
        .patch(`${route}/${nh.id}`)
        .send({
          name: 'new_name',
        });

      expect(response.statusCode).toBe(200);
    });
  });
  describe(`${route}/:id (DELETE)`, () => {
    it('deletes a neighbourhood', async () => {
      const nh = await neighbourhoodRepository.save({
        name: 'name',
      });

      const response = await request(app.getHttpServer()).delete(
        `${route}/${nh.id}`,
      );

      expect(response.statusCode).toBe(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
