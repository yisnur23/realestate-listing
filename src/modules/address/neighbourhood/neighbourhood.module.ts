import { Module } from '@nestjs/common';
import { NeighbourhoodService } from './neighbourhood.service';
import { NeighbourhoodController } from './neighbourhood.controller';
import { WoredaModule } from '../woreda/woreda.module';
import { NeighbourhoodRepository } from './neighbourhood.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Neighbourhood } from './entities/neighbourhood.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Neighbourhood]), WoredaModule],
  controllers: [NeighbourhoodController],
  providers: [NeighbourhoodService, NeighbourhoodRepository],
})
export class NeighbourhoodModule {}
