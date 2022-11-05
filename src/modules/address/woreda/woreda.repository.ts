import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../../common/classes';
import { Woreda } from './entities/woreda.entity';

@Injectable()
export class WoredaRepository extends BaseRepository<Woreda> {
  constructor(private dataSource: DataSource) {
    super(Woreda, dataSource.createEntityManager());
  }
}
