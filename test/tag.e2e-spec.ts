import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TagModule } from '../src/modules/tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testingDbConfig } from './testing-db-config';
import { CreateTagDto } from '../src/modules/tag/dto/create-tag.dto';
import { TagRepository } from '../src/modules/tag/tag.repository';
import crypto from 'crypto';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import {
  aws,
  AWSConfig,
  configSchema,
  database,
  google,
  session,
} from '../src/config';

describe('TagController (e2e)', () => {
  let app: INestApplication;
  let tagRepository: TagRepository;
  let connection;
  const route = '/tags';
  const id = crypto.randomUUID();
  const createTagDto: CreateTagDto = {
    name: 'tag_name',
  };
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(testingDbConfig),
        ConfigModule.forRoot({
          envFilePath: '../.env',
          isGlobal: true,
          validationOptions: {
            allowUnknown: true,
            abortEarly: true,
          },
          cache: true,
        }),

        AwsSdkModule.forRootAsync({
          defaultServiceOptions: {
            useFactory: (configService: ConfigService) => {
              const awsConfig = configService.get<AWSConfig>('aws');

              return {
                region: awsConfig.region,
                credentials: {
                  accessKeyId: awsConfig.accessKeyId,
                  secretAccessKey: awsConfig.secretAccessKey,
                },
              };
            },
            imports: [ConfigModule],
            inject: [ConfigService],
          },
          services: [
            {
              service: S3,
              serviceOptions: {
                signatureVersion: 'v4',
              },
            },
          ],
        }),
        TagModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    tagRepository = moduleFixture.get<TagRepository>(TagRepository);
    connection = tagRepository.manager.connection;

    await app.init();
  });

  describe(`${route} (POST)`, () => {
    it('creates a tag', async () => {
      const response = await request(app.getHttpServer())
        .post(route)
        .send(createTagDto);

      expect(response.statusCode).toBe(201);
    });
    it('returns a conflict error if a tag name already exists', async () => {
      await tagRepository.save(createTagDto);
      const response = await request(app.getHttpServer()).post(route).send({
        name: 'tag_name',
      });

      expect(response.statusCode).toBe(409);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe(
        `tag name ${createTagDto.name} already exists.`,
      );
    });
  });
  describe(`${route} (GET)`, () => {
    it('returns an array of tags', async () => {
      const tag = await tagRepository.save(createTagDto);
      const response = await request(app.getHttpServer()).get(route);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([tag]);
    });
  });
  describe(`${route}/:id (GET)`, () => {
    it('returns a tag', async () => {
      const tag = await tagRepository.save(createTagDto);
      const response = await request(app.getHttpServer()).get(
        `${route}/${tag.id}`,
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(tag);
    });
    it('returns a not found error if tag does not exist', async () => {
      const response = await request(app.getHttpServer()).get(`${route}/${id}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe(`tag with id ${id} not found`);
    });
  });

  describe(`${route}/:id (PATCH)`, () => {
    it('updates a tag', async () => {
      const tag = await tagRepository.save(createTagDto);
      const response = await request(app.getHttpServer())
        .patch(`${route}/${tag.id}`)
        .send({
          name: 'tag_name',
        });

      expect(response.statusCode).toBe(200);
    });
    it('returns a conflict error if a tag name already exists', async () => {
      const name = 'tag_2_name';
      const tag = await tagRepository.save(createTagDto);
      await tagRepository.save({
        name,
      });
      const response = await request(app.getHttpServer())
        .patch(`${route}/${tag.id}`)
        .send({ name });

      expect(response.statusCode).toBe(409);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe(`tag name ${name} already exists.`);
    });
  });
  describe(`${route}/:id (DELETE)`, () => {
    it('deletes a tag', async () => {
      const tag = await tagRepository.save(createTagDto);
      const response = await request(app.getHttpServer()).delete(
        `${route}/${tag.id}`,
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
