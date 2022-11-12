import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testingDbConfig } from './testing-db-config';
import crypto from 'crypto';
import { AddressModule } from '../src/modules/address/address.module';
import { RouterModule } from '@nestjs/core';
import { AddressRoutes } from '../src/modules/address/address.routes';
import { WoredaRepository } from '../src/modules/address/woreda/woreda.repository';
import { NeighbourhoodRepository } from '../src/modules/address/neighbourhood/neighbourhood.repository';
import { CityRepository } from '../src/modules/address/city/city.repository';
import { StateRepository } from '../src/modules/address/state/state.repository';
import { ListingRepository } from '../src/modules/listing/listing.repository';
import { ProfileRepository } from '../src/modules/profile/profile.repository';
import { State } from '../src/modules/address/state/entities/state.entity';
import { City } from '../src/modules/address/city/entities/city.entity';
import { Woreda } from '../src/modules/address/woreda/entities/woreda.entity';
import { Neighbourhood } from '../src/modules/address/neighbourhood/entities/neighbourhood.entity';
import { User } from '../src/modules/profile/entities/user.entity';
import { TagRepository } from '../src/modules/tag/tag.repository';
import { ProfileModule } from '../src/modules/profile/profile.module';
import { TagModule } from '../src/modules/tag/tag.module';
import { CreateListingDto } from '../src/modules/listing/dto/create-listing.dto';
import { Tag } from '../src/modules/tag/entities/tag.entity';
import { ListingModule } from '../src/modules/listing/listing.module';

describe('ListingsController (e2e)', () => {
  let app: INestApplication;
  let woredaRepository: WoredaRepository;
  let neighbourhoodRepository: NeighbourhoodRepository;
  let cityRepository: CityRepository;
  let stateRepository: StateRepository;
  let listingRepository: ListingRepository;
  let tagRepository: TagRepository;
  let profileRepository: ProfileRepository;
  let state: State;
  let city: City;
  let woreda: Woreda;
  let neighbourhood: Neighbourhood;
  let tag: Tag;
  let user: User;
  let connection;
  const createListingDto: CreateListingDto = {
    title: 'listing',
    description: 'description',
    price: 100000,
    floor_size: 250,
    lot_size: 350,
    year_built: 2009,
    total_number_of_rooms: 15,
    number_of_bed_rooms: 5,
    number_of_bath_rooms: 3,
    number_of_floors: 2,
    tags: [],
    neighbourhood_id: undefined,
  };
  const route = '/listings';
  const id = crypto.randomUUID();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(testingDbConfig),
        AddressModule,
        ProfileModule,
        TagModule,
        ListingModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    stateRepository = moduleFixture.get<StateRepository>(StateRepository);
    cityRepository = moduleFixture.get<CityRepository>(CityRepository);
    woredaRepository = moduleFixture.get<WoredaRepository>(WoredaRepository);
    neighbourhoodRepository = moduleFixture.get<NeighbourhoodRepository>(
      NeighbourhoodRepository,
    );
    profileRepository = moduleFixture.get<ProfileRepository>(ProfileRepository);
    tagRepository = moduleFixture.get<TagRepository>(TagRepository);
    listingRepository = moduleFixture.get<ListingRepository>(ListingRepository);
    connection = woredaRepository.manager.connection;

    user = await profileRepository.save({
      display_name: 'user',
      first_name: 'user',
      last_name: 'last',
      email: 'user@email.com',
      profile_picture: 'url',
    });
    state = await stateRepository.save({
      name: 'statename',
    });
    city = await cityRepository.save({
      name: 'city_name',
      state,
    });
    woreda = await woredaRepository.save({
      name: 'woreda_name',
      city,
    });
    neighbourhood = await neighbourhoodRepository.save({
      name: 'neighbourhood_name',
      woreda,
    });
    tag = await tagRepository.save({
      name: 'tag_name',
    });
    app.use((req, res, next) => {
      req.isAuthenticated = () => {
        return !!req.user;
      };
      next();
    });
    app.use((req, res, next) => {
      req.user = user;
      next();
    });
    await app.init();
  }, 15000);
  describe(`${route} (POST)`, () => {
    it('creates a listing', async () => {
      const secondTag = await tagRepository.save({
        name: 'second_tag',
      });
      createListingDto.tags = [tag.id, secondTag.id];
      createListingDto.neighbourhood_id = neighbourhood.id;
      const response = await request(app.getHttpServer())
        .post(route)
        .send(createListingDto);
      expect(response.statusCode).toBe(201);
    }, 15000);
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
