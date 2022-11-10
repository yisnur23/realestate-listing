import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { City } from '../../city/entities/city.entity';
import { Woreda } from '../../woreda/entities/woreda.entity';

@Entity()
export class Subcity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @OneToMany(() => Woreda, (woreda) => woreda.subcity)
  woredas: Woreda[];
  @ManyToOne(() => City, (city) => city.subCities, {
    nullable: false,
    onDelete: 'SET NULL',
  })
  city: City;
}
