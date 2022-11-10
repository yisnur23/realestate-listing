import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Listing } from './listing.entity';

export enum MediaItemType {
  VIDEO = 'video',
  IMAGE = 'image',
}

@Entity()
export class MediaItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    nullable: false,
  })
  url: string;
  @Column({
    type: 'enum',
    enum: MediaItemType,
  })
  type: MediaItemType;
  @Column()
  position: number;
  @ManyToOne(() => Listing, (listing) => listing.mediaItems)
  listing: Listing;
}
