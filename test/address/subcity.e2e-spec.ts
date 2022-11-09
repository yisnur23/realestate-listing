import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testingDbConfig } from '../testing-db-config';
import crypto from 'crypto';
import { AddressModule } from '../../src/modules/address/address.module';
import { RouterModule } from '@nestjs/core';
import { AddressRoutes } from '../../src/modules/address/address.routes';
import { CityRepository } from '../../src/modules/address/city/city.repository';
import { SubCityRepository } from '../../src/modules/address/subcity/subcity.repository';
import { CreateSubcityDto } from '../../src/modules/address/subcity/dto/create-subcity.dto';
import { StateRepository } from '../../src/modules/address/state/state.repository';

describe('SubcityController (e2e)', () => {
  let app: INestApplication;
  let cityRepository: CityRepository;
  let subcityRepository: SubCityRepository;
  let stateRepository: StateRepository;
  let connection;
  const route = '/address/subcities';
  const id = crypto.randomUUID();
  const createSubcityDto: CreateSubcityDto = {
    name: 'subcity_name',
    city_id: '',
  };
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(testingDbConfig),
        AddressModule,
        RouterModule.register(AddressRoutes),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    cityRepository = moduleFixture.get<CityRepository>(CityRepository);
    subcityRepository = moduleFixture.get<SubCityRepository>(SubCityRepository);
    stateRepository = moduleFixture.get<StateRepository>(StateRepository);
    connection = subcityRepository.manager.connection;

    await app.init();
  });

  describe(`${route} (POST)`, () => {
    it('creates a subcity', async () => {
      const state = await stateRepository.save({
        name: 'state_name',
      });
      const city = await cityRepository.save({
        name: 'city_name',
        state,
      });
      createSubcityDto.city_id = city.id;
      const response = await request(app.getHttpServer())
        .post(route)
        .send(createSubcityDto);

      expect(response.statusCode).toBe(201);
    });
  });
  describe(`${route} (GET)`, () => {
    it('returns an array of subcities', async () => {
      const state = await stateRepository.save({
        name: 'state_name',
      });
      const city = await cityRepository.save({
        name: 'city_name',
        state,
      });
      const subcity = await subcityRepository.save({
        name: 'subcity_name',
        city,
      });
      const response = await request(app.getHttpServer()).get(route);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([
        {
          id: subcity.id,
          name: subcity.name,
        },
      ]);
    });
  });
  describe(`${route}/:id (GET)`, () => {
    it('returns a subcity', async () => {
      const state = await stateRepository.save({
        name: 'state_name',
      });
      const city = await cityRepository.save({
        name: 'city_name',
        state,
      });
      const subcity = await subcityRepository.save({
        name: 'subcity_name',
        city,
      });
      const response = await request(app.getHttpServer()).get(
        `${route}/${subcity.id}`,
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: subcity.id,
        name: subcity.name,
      });
    });
    it('returns a not found error if subcity does not exist', async () => {
      const response = await request(app.getHttpServer()).get(`${route}/${id}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe(`subcity with id ${id} not found`);
    });
  });

  describe(`${route}/:id (PATCH)`, () => {
    it('updates a subcity', async () => {
      const state = await stateRepository.save({
        name: 'state_name',
      });
      const city = await cityRepository.save({
        name: 'city_name',
        state,
      });

      const subcity = await subcityRepository.save({
        name: 'subcity_name',
        city,
      });
      const response = await request(app.getHttpServer())
        .patch(`${route}/${subcity.id}`)
        .send({
          name: 'new_name',
        });

      expect(response.statusCode).toBe(200);
    });
  });
  describe(`${route}/:id (DELETE)`, () => {
    it('deletes a subcity', async () => {
      const state = await stateRepository.save({
        name: 'state_name',
      });
      const city = await cityRepository.save({
        name: 'city_name',
        state,
      });
      const subcity = await subcityRepository.save({
        name: 'subcity_name',
        city,
      });
      const response = await request(app.getHttpServer()).delete(
        `${route}/${subcity.id}`,
      );

      expect(response.statusCode).toBe(200);
    });
  });
  afterEach(async () => {
    const entities = connection.entityMetadatas;

    for (const entity of entities) {
      const repository = connection.getRepository(entity.name);
      await repository.delete({});
    }
  });
  afterAll(async () => {
    await connection.destroy();
    await app.close();
  });
});
