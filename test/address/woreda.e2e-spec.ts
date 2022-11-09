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
import { CreateWoredaDto } from '../../src/modules/address/woreda/dto/create-woreda.dto';
import { WoredaRepository } from '../../src/modules/address/woreda/woreda.repository';
import { StateRepository } from '../../src/modules/address/state/state.repository';

describe('WoredaController (e2e)', () => {
  let app: INestApplication;
  let woredaRepository: WoredaRepository;
  let cityRepository: CityRepository;
  let subcityRepository: SubCityRepository;
  let stateRepository: StateRepository;
  let connection;
  const route = '/address/woredas';
  const id = crypto.randomUUID();
  const createWoredaDto: CreateWoredaDto = {
    name: 'woreda_name',
    city_id: '',
    subcity_id: '',
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
    stateRepository = moduleFixture.get<StateRepository>(StateRepository);
    cityRepository = moduleFixture.get<CityRepository>(CityRepository);
    subcityRepository = moduleFixture.get<SubCityRepository>(SubCityRepository);
    woredaRepository = moduleFixture.get<WoredaRepository>(WoredaRepository);
    connection = subcityRepository.manager.connection;

    await app.init();
  });

  describe(`${route} (POST)`, () => {
    it('creates a woreda that belongs to a city', async () => {
      const state = await stateRepository.save({
        name: 'state_name',
      });
      const city = await cityRepository.save({
        name: 'city_name',
        state,
      });
      createWoredaDto.city_id = city.id;
      const response = await request(app.getHttpServer()).post(route).send({
        name: createWoredaDto.name,
        city_id: createWoredaDto.city_id,
      });

      expect(response.statusCode).toBe(201);
    });
    it('creates a woreda that belongs to a subcity', async () => {
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
      createWoredaDto.subcity_id = subcity.id;
      const response = await request(app.getHttpServer()).post(route).send({
        name: createWoredaDto.name,
        subcity_id: createWoredaDto.subcity_id,
      });

      expect(response.statusCode).toBe(201);
    });
  });

  describe(`${route} (GET)`, () => {
    it('returns an array of woredas', async () => {
      const state = await stateRepository.save({
        name: 'state_name',
      });

      const city = await cityRepository.save({
        name: 'city_name',
        state,
      });
      const woreda = await woredaRepository.save({
        name: 'woreda',
        city,
      });
      const response = await request(app.getHttpServer()).get(route);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([
        {
          id: woreda.id,
          name: woreda.name,
        },
      ]);
    });
  });
  describe(`${route}/:id (GET)`, () => {
    it('returns a woreda', async () => {
      const state = await stateRepository.save({
        name: 'state_name',
      });

      const city = await cityRepository.save({
        name: 'city_name',
        state,
      });
      const woreda = await woredaRepository.save({
        name: 'woreda',
        city,
      });
      const response = await request(app.getHttpServer()).get(
        `${route}/${woreda.id}`,
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: woreda.id,
        name: woreda.name,
      });
    });
    it('returns a not found error if woreda does not exist', async () => {
      const response = await request(app.getHttpServer()).get(`${route}/${id}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe(`woreda with id ${id} not found`);
    });
  });

  describe(`${route}/:id (PATCH)`, () => {
    it('updates a woreda', async () => {
      const state = await stateRepository.save({
        name: 'state_name',
      });

      const city = await cityRepository.save({
        name: 'city_name',
        state,
      });
      const woreda = await woredaRepository.save({
        name: 'woreda',
        city,
      });
      const response = await request(app.getHttpServer())
        .patch(`${route}/${woreda.id}`)
        .send({
          name: 'new_name',
        });

      expect(response.statusCode).toBe(200);
    });
  });
  describe(`${route}/:id (DELETE)`, () => {
    it('deletes a woreda', async () => {
      const state = await stateRepository.save({
        name: 'state_name',
      });

      const city = await cityRepository.save({
        name: 'city_name',
        state,
      });
      const woreda = await woredaRepository.save({
        name: 'woreda',
        city,
      });
      const response = await request(app.getHttpServer()).delete(
        `${route}/${woreda.id}`,
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
