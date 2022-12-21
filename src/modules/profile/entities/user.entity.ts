import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  BaseEntity
} from 'typeorm';
import { Listing } from '../../listing/entities/listing.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  first_name: string;
  @Column()
  last_name: string;
  @Column({
    nullable: true,
  })
  display_name: string;
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;
  @Column({
    unique: true,
  })
  email: string;
  @Column({
    nullable: true,
    unique: true,
  })
  phone: string;

  @Column({
    default: false,
  })
  is_verified: boolean;

  @Column({
    nullable: true,
  })
  telegram_link: string;

  @Column({
    nullable: true,
  })
  profile_picture: string;
  @OneToMany(() => Listing, (listing) => listing.user, { onDelete: 'SET NULL' })
  listings: Listing[];
  @ManyToMany(() => Listing)
  @JoinTable()
  favorites: Listing[];
}
