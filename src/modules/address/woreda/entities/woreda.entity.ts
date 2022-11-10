import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { City } from '../../city/entities/city.entity';
import { Neighbourhood } from '../../neighbourhood/entities/neighbourhood.entity';
import { Subcity } from '../../subcity/entities/subcity.entity';

@Entity()
export class Woreda {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @OneToMany(() => Neighbourhood, (neighbourhood) => neighbourhood.woreda)
  neighbourhoods: Neighbourhood[];
  @ManyToOne(() => Subcity, (subcity) => subcity.woredas, {
    onDelete: 'SET NULL',
  })
  subcity: Subcity;
  @ManyToOne(() => City, (city) => city.woredas, { onDelete: 'SET NULL' })
  city: City;
}
