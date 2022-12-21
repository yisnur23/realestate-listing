import {
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity
} from 'typeorm';
import { Listing } from '../../../listing/entities/listing.entity';
import { State } from '../../state/entities/state.entity';

@Entity()
export class City extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;

  @OneToMany(() => Listing, (listing) => listing.city)
  listings: Listing[];
  @ManyToOne(() => State, (state) => state.cities, {
    nullable: false,
    onDelete: 'SET NULL',
  })
  state: State;
}
