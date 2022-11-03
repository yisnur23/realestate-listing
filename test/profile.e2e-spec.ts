import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testingDbConfig } from './testing-db-config';
import { User } from '../src/modules/profile/entities/user.entity';
import { ProfileRepository } from '../src/modules/profile/profile.repository';
import { CreateProfileDto } from '../src/modules/profile/dto/profile.dto';
import crypto from 'crypto';
import { ProfileModule } from '../src/modules/profile/profile.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from '../src/modules/auth/auth.guard';
import { AbilitiesGuard } from '../src/modules/ability/ability.guard';
import { AbilityModule } from '../src/modules/ability/ability.module';

describe('ProfileController (e2e)', () => {
  let app: INestApplication;
  let profileRepository: ProfileRepository;
  const route = '/profile/me';
  let user: User;
  const id = crypto.randomUUID();
  const createProfileDto: CreateProfileDto = {
    display_name: 'user',
    first_name: 'user',
    last_name: 'last',
    email: 'user@email.com',
    profile_picture: 'url',
  };
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(testingDbConfig),
        ProfileModule,
        AbilityModule,
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: AuthenticationGuard,
        },
        {
          provide: APP_GUARD,
          useClass: AbilitiesGuard,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    profileRepository = moduleFixture.get<ProfileRepository>(ProfileRepository);
    user = await profileRepository.save(createProfileDto);
    app.use((req, res, next) => {
      req.isAuthenticated = () => {
        return !!req.user;
      };
      next();
    });
  });

  describe('/profile/:id (GET)', () => {
    it('returns a user, with sensetive data filtered out', async () => {
      await app.init();
      const response = await request(app.getHttpServer()).get(
        `/profile/${user.id}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).not.toHaveProperty('role');
      expect(response.body).not.toHaveProperty('last_name');
      expect(response.body).not.toHaveProperty('email');
    });
    it('returns a 404 message if user does not exist', async () => {
      await app.init();
      const response = await request(app.getHttpServer()).get(`/profile/${id}`);
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe(`user with id ${id} not found`);
    });
  });

  describe(`${route} (GET)`, () => {
    it('returns a forbidden error if user is not authenticated', async () => {
      await app.init();
      const response = await request(app.getHttpServer()).get(route);
      expect(response.statusCode).toBe(403);
    });
    it('returns a users profile, with sensetive data filtered out', async () => {
      // eslint-disable-next-line
      app.use((req, res, next) => {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
        };

        next();
      });
      await app.init();
      const response = await request(app.getHttpServer()).get(route);
      expect(response.statusCode).toBe(200);
      expect(response.body).not.toHaveProperty('role');
    });
  });
  describe(`${route} (PATCH)`, () => {
    it('returns a forbidden error if user is not authenticated', async () => {
      await app.init();
      const response = await request(app.getHttpServer()).patch(route);
      expect(response.statusCode).toBe(403);
    });
    it('updates a users profile, by filtering out data from input', async () => {
      // eslint-disable-next-line
      app.use((req, res, next) => {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
        };

        next();
      });
      await app.init();
      const update = {
        first_name: 'updated_name',
        role: 'admin',
        is_verified: true,
      };
      const response = await request(app.getHttpServer())
        .patch(route)
        .send(update);
      expect(response.statusCode).toBe(200);
      const updatedUser = await profileRepository.findById(user.id);
      expect(updatedUser.first_name).toBe(update.first_name);
      expect(updatedUser.role).not.toBe(update.role);
      expect(updatedUser.is_verified).not.toBe(update.is_verified);
    });
  });
  describe(`${route} (DELETE)`, () => {
    it('returns a forbidden error if user is not authenticated', async () => {
      await app.init();
      const response = await request(app.getHttpServer()).delete(route);
      expect(response.statusCode).toBe(403);
    });
    it('deletes profile', async () => {
      // eslint-disable-next-line
      app.use((req, res, next) => {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
        };

        next();
      });
      await app.init();

      const response = await request(app.getHttpServer()).delete(route);

      expect(response.statusCode).toBe(200);
      const updatedUser = await profileRepository.findById(user.id);
      expect(updatedUser).toBe(null);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
