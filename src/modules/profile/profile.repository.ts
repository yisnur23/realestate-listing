import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class ProfileRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  findByEmail(email: string) {
    return this.findOneBy({
      email,
    });
  }
}
