import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { StateModule } from '../state/state.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { CityRepository } from './city.repository';

@Module({
  imports: [TypeOrmModule.forFeature([City]), StateModule],
  controllers: [CityController],
  providers: [CityService, CityRepository],
  exports: [CityService],
})
export class CityModule {}
