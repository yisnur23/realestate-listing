import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testingDbConfig } from '../testing-db-config';
import crypto from 'crypto';
import { StateRepository } from '../../src/modules/address/state/state.repository';
import { AddressModule } from '../../src/modules/address/address.module';
import { RouterModule } from '@nestjs/core';
import { AddressRoutes } from '../../src/modules/address/address.routes';
import { CreateCityDto } from '../../src/modules/address/city/dto/create-city.dto';
import { CityRepository } from '../../src/modules/address/city/city.repository';

describe('CityController (e2e)', () => {
  let app: INestApplication;
  let cityRepository: CityRepository;
  let stateRepository: StateRepository;
  const route = '/address/cities';
  const id = crypto.randomUUID();
  const createCityDto: CreateCityDto = {
    name: 'city_name',
    state_id: '',
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
    stateRepository = moduleFixture.get<StateRepository>(StateRepository);
    await app.init();
  });

  describe(`${route} (POST)`, () => {
    it('creates a city', async () => {
      const state = await stateRepository.save({
        name: 'state_name',
      });
      createCityDto.state_id = state.id;
      const response = await request(app.getHttpServer())
        .post(route)
        .send(createCityDto);

      expect(response.statusCode).toBe(201);
    });
  });
  describe(`${route} (GET)`, () => {
    it('returns an array of cities', async () => {
      const state = await stateRepository.save({
        name: 'state_name',
      });
      createCityDto.state_id = state.id;
      const city = await cityRepository.save(createCityDto);
      const response = await request(app.getHttpServer()).get(route);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([
        {
          id: city.id,
          name: city.name,
        },
      ]);
    });
  });
  describe(`${route}/:id (GET)`, () => {
    it('returns a city', async () => {
      const state = await stateRepository.save({
        name: 'state_name',
      });
      createCityDto.state_id = state.id;
      const city = await cityRepository.save(createCityDto);
      const response = await request(app.getHttpServer()).get(
        `${route}/${city.id}`,
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: city.id,
        name: city.name,
      });
    });
    it('returns a not found error if city does not exist', async () => {
      const response = await request(app.getHttpServer()).get(`${route}/${id}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe(`city with id ${id} not found`);
    });
  });

  describe(`${route}/:id (PATCH)`, () => {
    it('updates a city', async () => {
      const state = await stateRepository.save({
        name: 'state_name',
      });
      createCityDto.state_id = state.id;
      const city = await cityRepository.save(createCityDto);
      const response = await request(app.getHttpServer())
        .patch(`${route}/${city.id}`)
        .send({
          name: 'new_name',
        });

      expect(response.statusCode).toBe(200);
    });
  });
  describe(`${route}/:id (DELETE)`, () => {
    it('deletes a city', async () => {
      const state = await stateRepository.save({
        name: 'state_name',
      });
      createCityDto.state_id = state.id;
      const city = await cityRepository.save(createCityDto);
      const response = await request(app.getHttpServer()).delete(
        `${route}/${city.id}`,
      );

      expect(response.statusCode).toBe(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
