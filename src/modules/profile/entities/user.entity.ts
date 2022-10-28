import { PrimaryGeneratedColumn, Entity, Column } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  SELLER = 'seller',
  BUYER = 'buyer',
}

export enum SignUpMethod {
  PASSWORD = 'password',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
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
    nullable: true,
  })
  password: string;
  @Column({
    default: false,
  })
  is_verified: boolean;
  @Column({
    type: 'enum',
    enum: SignUpMethod,
    default: SignUpMethod.PASSWORD,
  })
  sign_up_method: SignUpMethod;
  @Column({
    nullable: true,
  })
  telegram_link: string;
  @Column({
    nullable: true,
  })
  whatsapp_number: string;
  @Column({
    nullable: true,
  })
  profile_picture: string;
}
