import { Module } from '@nestjs/common';
import { StateModule } from './state/state.module';
import { CityModule } from './city/city.module';
import { SubcityModule } from './subcity/subcity.module';
import { WoredaModule } from './woreda/woreda.module';
import { NeighbourhoodModule } from './neighbourhood/neighbourhood.module';

@Module({
  imports: [
    StateModule,
    CityModule,
    SubcityModule,
    WoredaModule,
    NeighbourhoodModule,
  ],
})
export class AddressModule {}
