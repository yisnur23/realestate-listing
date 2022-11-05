import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Woreda } from '../../woreda/entities/woreda.entity';

@Entity()
export class Neighbourhood {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @ManyToOne(() => Woreda, (woreda) => woreda.neighbourhoods)
  woreda: Woreda;
}
