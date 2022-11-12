import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Listing } from '../../../listing/entities/listing.entity';
import { Woreda } from '../../woreda/entities/woreda.entity';

@Entity()
export class Neighbourhood {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @ManyToOne(() => Woreda, (woreda) => woreda.neighbourhoods, {
    nullable: false,
    onDelete: 'SET NULL',
  })
  woreda: Woreda;
  @OneToMany(() => Listing, (listing) => listing.neighbourhood, {
    onDelete: 'SET NULL',
  })
  listings: Listing[];
}
