import { forwardRef, Module } from '@nestjs/common';
import { ListingService } from './listing.service';
import { ListingController } from './listing.controller';
import { ListingRepository } from './listing.repository';
import { TagModule } from '../tag/tag.module';
import { ProfileModule } from '../profile/profile.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from './entities/listing.entity';
import { CityModule } from '../address/city/city.module';
import { AbilityModule } from '../ability/ability.module';
import { MediaItemModule } from '../media-item/media-item.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Listing]),
    forwardRef(() => ProfileModule),
    forwardRef(() => CityModule),
    forwardRef(() => TagModule),
    AbilityModule,
    MediaItemModule,
  ],
  controllers: [ListingController],
  providers: [ListingService, ListingRepository],
  exports: [ListingService],
})
export class ListingModule {}
