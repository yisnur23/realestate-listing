import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Point } from 'geojson';
import { User } from '../../profile/entities/user.entity';
import { MediaItem } from './media-item.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { Neighbourhood } from '../../address/neighbourhood/entities/neighbourhood.entity';

@Entity()
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    nullable: false,
  })
  title: string;
  @Column({
    nullable: false,
    type: 'text',
  })
  description: string;
  @Column({
    type: 'decimal',
  })
  price: number;
  @Column()
  number_of_floors: number;
  @Column()
  floor_size: number;
  @Column()
  lot_size: number;
  @Column()
  year_built: number;
  @Column()
  total_number_of_rooms: number;
  @Column()
  number_of_bath_rooms: number;
  @Column()
  number_of_bed_rooms: number;
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: Point;

  @ManyToOne(() => User, (user) => user.listings, { onDelete: 'SET NULL' })
  user: User;

  @ManyToOne(() => Neighbourhood, (neighbourhood) => neighbourhood.listings, {
    onDelete: 'SET NULL',
  })
  neighbourhood: Neighbourhood;

  @OneToMany(() => MediaItem, (mediaItem) => mediaItem.listing, {
    onDelete: 'SET NULL',
  })
  mediaItems: MediaItem[];

  @ManyToMany(() => Tag, (tag) => tag.listings, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  tags: Tag[];
}
