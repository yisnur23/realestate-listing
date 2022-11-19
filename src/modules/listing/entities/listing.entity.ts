import {
  Column,
  CreateDateColumn,
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
import { City } from '../../address/city/entities/city.entity';

export enum ListingType {
  Apartment = 'Apartment',
  Villa = 'Villa',
  Land = 'Land',
  Duplex = 'Duplex',
  Condominium = 'Condominium',
}

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
    nullable: true,
  })
  price: number;
  @Column({
    nullable: true,
  })
  number_of_floors: number;
  @Column({
    nullable: true,
  })
  floor_size: number;
  @Column({
    nullable: true,
  })
  lot_size: number;
  @Column({
    nullable: true,
  })
  year_built: number;
  @Column({
    nullable: true,
  })
  total_number_of_rooms: number;
  @Column({
    nullable: true,
  })
  number_of_bath_rooms: number;
  @Column({
    nullable: true,
  })
  number_of_bed_rooms: number;
  @Column({
    type: 'enum',
    enum: ListingType,
    nullable: true,
  })
  type: ListingType;
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: Point;
  @Column({
    nullable: true,
  })
  neighbourhood: string;
  @CreateDateColumn()
  createdDate: Date;

  @ManyToOne(() => User, (user) => user.listings, { onDelete: 'SET NULL' })
  user: User;

  @ManyToOne(() => City, (city) => city.listings, {
    onDelete: 'SET NULL',
  })
  city: City;

  @OneToMany(() => MediaItem, (mediaItem) => mediaItem.listing, {
    onDelete: 'SET NULL',
  })
  mediaItems: MediaItem[];

  @ManyToMany(() => Tag, (tag) => tag.listings, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'listing_tags',
  })
  tags: Tag[];

  @Column('tsvector', { select: false, nullable: true })
  document: any;
}
