import { Module } from '@nestjs/common';
import { ListingService } from './listing.service';
import { ListingController } from './listing.controller';
import { ListingRepository } from './listing.repository';
import { TagModule } from '../tag/tag.module';
import { ProfileModule } from '../profile/profile.module';
import { NeighbourhoodModule } from '../address/neighbourhood/neighbourhood.module';

@Module({
  imports: [ProfileModule, NeighbourhoodModule, TagModule],
  controllers: [ListingController],
  providers: [ListingService, ListingRepository],
})
export class ListingModule {}
