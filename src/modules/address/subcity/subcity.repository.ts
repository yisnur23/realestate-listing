import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../../common/classes';
import { Subcity } from './entities/subcity.entity';

@Injectable()
export class SubCityRepository extends BaseRepository<Subcity> {
  constructor(private dataSource: DataSource) {
    super(Subcity, dataSource.createEntityManager());
  }
}
