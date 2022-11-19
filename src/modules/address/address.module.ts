import { Module } from '@nestjs/common';
import { StateModule } from './state/state.module';
import { CityModule } from './city/city.module';

@Module({
  imports: [StateModule, CityModule],
})
export class AddressModule {}
