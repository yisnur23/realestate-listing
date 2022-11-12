import { forwardRef, Module } from '@nestjs/common';
import { ListingService } from './listing.service';
import { ListingController } from './listing.controller';
import { ListingRepository } from './listing.repository';
import { TagModule } from '../tag/tag.module';
import { ProfileModule } from '../profile/profile.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from './entities/listing.entity';
import { AddressModule } from '../address/address.module';
import { MediaItem } from './entities/media-item.entity';
import { NeighbourhoodModule } from '../address/neighbourhood/neighbourhood.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Listing, MediaItem]),
    forwardRef(() => ProfileModule),
    forwardRef(() => NeighbourhoodModule),
    forwardRef(() => TagModule),
  ],
  controllers: [ListingController],
  providers: [ListingService, ListingRepository],
  exports: [ListingService],
})
export class ListingModule {}
