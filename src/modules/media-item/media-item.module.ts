import { Module } from '@nestjs/common';
import { MediaItemService } from './media-item.service';
import { MediaItemController } from './media-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaItem } from './entities/media-item.entity';
import { MediaItemRepository } from './media-item.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MediaItem])],
  controllers: [MediaItemController],
  providers: [MediaItemService, MediaItemRepository],
  exports: [MediaItemService],
})
export class MediaItemModule {}
