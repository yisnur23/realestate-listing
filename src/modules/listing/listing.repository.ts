import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/classes';
import { Listing } from './entities/listing.entity';

@Injectable()
export class ListingRepository extends BaseRepository<Listing> {
  constructor(private dataSource: DataSource) {
    super(Listing, dataSource.createEntityManager());
  }
}
