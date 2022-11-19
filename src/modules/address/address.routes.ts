import { AddressModule } from './address.module';
import { CityModule } from './city/city.module';
import { StateModule } from './state/state.module';
export const AddressRoutes = [
  {
    path: 'address',
    module: AddressModule,
    children: [
      {
        path: 'states',
        module: StateModule,
      },
      {
        path: 'cities',
        module: CityModule,
      },
    ],
  },
];
