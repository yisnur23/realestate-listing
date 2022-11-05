import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../../common/classes';
import { State } from './entities/state.entity';

@Injectable()
export class StateRepository extends BaseRepository<State> {
  constructor(private dataSource: DataSource) {
    super(State, dataSource.createEntityManager());
  }
}
