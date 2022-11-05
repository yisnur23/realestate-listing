import { Module } from '@nestjs/common';
import { SubcityService } from './subcity.service';
import { SubcityController } from './subcity.controller';
import { CityModule } from '../city/city.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcity } from './entities/subcity.entity';
import { SubCityRepository } from './subcity.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Subcity]), CityModule],
  controllers: [SubcityController],
  providers: [SubcityService, SubCityRepository],
  exports: [SubcityService],
})
export class SubcityModule {}
