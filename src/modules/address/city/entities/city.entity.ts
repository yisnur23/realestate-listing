import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { State } from '../../state/entities/state.entity';
import { Subcity } from '../../subcity/entities/subcity.entity';
import { Woreda } from '../../woreda/entities/woreda.entity';

@Entity()
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @OneToMany(() => Subcity, (subcity) => subcity.city)
  subCities: Subcity[];
  @OneToMany(() => Woreda, (woreda) => woreda.city)
  woredas: Woreda[];
  @ManyToOne(() => State, (state) => state.cities)
  state: State;
}
