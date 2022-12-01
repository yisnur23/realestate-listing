import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Listing } from './modules/listing/entities/listing.entity';
import { User } from './modules/profile/entities/user.entity';
import { MediaItem } from './modules/media-item/entities/media-item.entity';
import { City } from './modules/address/city/entities/city.entity';
import { State } from './modules/address/state/entities/state.entity';
import { Tag } from './modules/tag/entities/tag.entity';

import { initialSchema1668934398753 } from './migrations/1668934398753-initial-schema';
import { fullTextSearch1668934579007 } from './migrations/1668934579007-full-text-search';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  migrations: [initialSchema1668934398753, fullTextSearch1668934579007],
  entities: [Listing, User, MediaItem, City, State, Tag],
});
