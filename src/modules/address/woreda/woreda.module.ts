import { Module } from '@nestjs/common';
import { WoredaService } from './woreda.service';
import { WoredaController } from './woreda.controller';
import { CityModule } from '../city/city.module';
import { SubcityModule } from '../subcity/subcity.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Woreda } from './entities/woreda.entity';
import { WoredaRepository } from './woreda.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Woreda]), CityModule, SubcityModule],
  controllers: [WoredaController],
  providers: [WoredaService, WoredaRepository],
  exports: [WoredaService],
})
export class WoredaModule {}
