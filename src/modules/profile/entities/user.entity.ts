import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Listing } from '../../listing/entities/listing.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User {
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
    nullable: false,
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
  @OneToMany(() => Listing, (listing) => listing.user)
  listings: Listing[];
  @ManyToMany(() => Listing)
  favorites: Listing[];
}
