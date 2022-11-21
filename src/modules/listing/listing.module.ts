import { forwardRef, Module } from '@nestjs/common';
import { ListingService } from './listing.service';
import { ListingController } from './listing.controller';
import { ListingRepository } from './listing.repository';
import { TagModule } from '../tag/tag.module';
import { ProfileModule } from '../profile/profile.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from './entities/listing.entity';
import { MediaItem } from './entities/media-item.entity';
import { CityModule } from '../address/city/city.module';
import { AbilityModule } from '../ability/ability.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Listing, MediaItem]),
    forwardRef(() => ProfileModule),
    forwardRef(() => CityModule),
    forwardRef(() => TagModule),
    AbilityModule,
  ],
  controllers: [ListingController],
  providers: [ListingService, ListingRepository],
  exports: [ListingService],
})
export class ListingModule {}
