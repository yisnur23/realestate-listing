import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../../common/classes';
import { City } from './entities/city.entity';

@Injectable()
export class CityRepository extends BaseRepository<City> {
  constructor(private dataSource: DataSource) {
    super(City, dataSource.createEntityManager());
  }
}
