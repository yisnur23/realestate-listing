import { forwardRef, Module } from '@nestjs/common';
import { NeighbourhoodService } from './neighbourhood.service';
import { NeighbourhoodController } from './neighbourhood.controller';
import { WoredaModule } from '../woreda/woreda.module';
import { NeighbourhoodRepository } from './neighbourhood.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Neighbourhood } from './entities/neighbourhood.entity';
import { ListingModule } from '../../listing/listing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Neighbourhood]),
    WoredaModule,
    forwardRef(() => ListingModule),
  ],
  controllers: [NeighbourhoodController],
  providers: [NeighbourhoodService, NeighbourhoodRepository],
  exports: [NeighbourhoodService],
})
export class NeighbourhoodModule {}
