import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagRepository extends Repository<Tag> {
  constructor(private dataSource: DataSource) {
    super(Tag, dataSource.createEntityManager());
  }
}
