import { DataSource, In } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Tag } from './entities/tag.entity';
import { BaseRepository } from '../../common/classes';

@Injectable()
export class TagRepository extends BaseRepository<Tag> {
  constructor(private dataSource: DataSource) {
    super(Tag, dataSource.createEntityManager());
  }
  findOneByName(name: string) {
    return this.findOneBy({
      name,
    });
  }
  findWithIds(ids: string[]) {
    return this.findBy({
      id: In(ids),
    });
  }
}
