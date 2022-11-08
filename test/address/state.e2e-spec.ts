import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testingDbConfig } from '../testing-db-config';
import crypto from 'crypto';
import { StateRepository } from '../../src/modules/address/state/state.repository';
import { StateDto } from '../../src/modules/address/state/dto/create-state.dto';
import { AddressModule } from '../../src/modules/address/address.module';
import { RouterModule } from '@nestjs/core';
import { AddressRoutes } from '../../src/modules/address/address.routes';

describe('StateController (e2e)', () => {
  let app: INestApplication;
  let stateRepository: StateRepository;
  let connection;
  const route = '/address/states';
  const id = crypto.randomUUID();
  const createStateDto: StateDto = {
    name: 'state_name',
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
    connection = stateRepository.manager.connection;
    await app.init();
  });

  describe(`${route} (POST)`, () => {
    it('creates a state', async () => {
      const response = await request(app.getHttpServer())
        .post(route)
        .send(createStateDto);

      expect(response.statusCode).toBe(201);
    });
    it('returns a conflict error if a state name already exists', async () => {
      await stateRepository.save(createStateDto);
      const response = await request(app.getHttpServer())
        .post(route)
        .send(createStateDto);
      expect(response.statusCode).toBe(409);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe(
        `state name ${createStateDto.name} already exists.`,
      );
    });
  });
  describe(`${route} (GET)`, () => {
    it('returns an array of states', async () => {
      const state = await stateRepository.save(createStateDto);
      const response = await request(app.getHttpServer()).get(route);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([state]);
    });
  });
  describe(`${route}/:id (GET)`, () => {
    it('returns a state', async () => {
      const state = await stateRepository.save(createStateDto);
      const response = await request(app.getHttpServer()).get(
        `${route}/${state.id}`,
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(state);
    });
    it('returns a not found error if state does not exist', async () => {
      const response = await request(app.getHttpServer()).get(`${route}/${id}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe(`state with id ${id} not found`);
    });
  });

  describe(`${route}/:id (PATCH)`, () => {
    it('updates a state', async () => {
      const state = await stateRepository.save(createStateDto);
      const response = await request(app.getHttpServer())
        .patch(`${route}/${state.id}`)
        .send(createStateDto);

      expect(response.statusCode).toBe(200);
    });
    it('returns a conflict error if a state name already exists', async () => {
      const name = 'state_name_2';
      const state = await stateRepository.save(createStateDto);
      await stateRepository.save({
        name,
      });
      const response = await request(app.getHttpServer())
        .patch(`${route}/${state.id}`)
        .send({ name });

      expect(response.statusCode).toBe(409);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe(`state name ${name} already exists.`);
    });
  });
  describe(`${route}/:id (DELETE)`, () => {
    it('deletes a state', async () => {
      const state = await stateRepository.save(createStateDto);
      const response = await request(app.getHttpServer()).delete(
        `${route}/${state.id}`,
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
