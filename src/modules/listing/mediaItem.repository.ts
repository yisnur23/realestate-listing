import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/classes';
import { MediaItem } from './entities/media-item.entity';

@Injectable()
export class MediaItemRepository extends BaseRepository<MediaItem> {
  constructor(private dataSource: DataSource) {
    super(MediaItem, dataSource.createEntityManager());
  }
}
