import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Listing } from '../../listing/entities/listing.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    unique: true,
  })
  name: string;
  @ManyToMany(() => Listing, (listing) => listing.tags, {
    onDelete: 'CASCADE',
  })
  listings: Listing[];
}
