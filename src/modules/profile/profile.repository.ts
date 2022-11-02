import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { BaseRepository } from '../../common/classes';

@Injectable()
export class ProfileRepository extends BaseRepository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  findUserByEmail(email: string) {
    return this.findOneBy({
      email,
    });
  }
}
