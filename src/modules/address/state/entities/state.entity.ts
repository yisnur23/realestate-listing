import { Column, Entity, OneToMany, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { City } from '../../city/entities/city.entity';

@Entity()
export class State extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @OneToMany(() => City, (city) => city.state)
  cities: City[];
}
