import { AddressModule } from './address.module';
import { CityModule } from './city/city.module';
import { NeighbourhoodModule } from './neighbourhood/neighbourhood.module';
import { StateModule } from './state/state.module';
import { SubcityModule } from './subcity/subcity.module';
import { WoredaModule } from './woreda/woreda.module';

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
      {
        path: 'subcities',
        module: SubcityModule,
      },
      {
        path: 'woredas',
        module: WoredaModule,
      },
      {
        path: 'neighbourhoods',
        module: NeighbourhoodModule,
      },
    ],
  },
];
