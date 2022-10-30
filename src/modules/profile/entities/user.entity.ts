import { PrimaryGeneratedColumn, Entity, Column } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  SELLER = 'seller',
  BUYER = 'buyer',
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
    default: UserRole.BUYER,
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
}
