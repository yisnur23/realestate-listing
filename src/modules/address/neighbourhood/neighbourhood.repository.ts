import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../../common/classes';
import { Neighbourhood } from './entities/neighbourhood.entity';

@Injectable()
export class NeighbourhoodRepository extends BaseRepository<Neighbourhood> {
  constructor(private dataSource: DataSource) {
    super(Neighbourhood, dataSource.createEntityManager());
  }
}
