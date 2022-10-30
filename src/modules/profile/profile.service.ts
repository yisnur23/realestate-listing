import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/profile.dto';
import { User } from './entities/user.entity';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(private profileRepository: ProfileRepository) {}

  async createUser(user: CreateProfileDto) {
    return this.profileRepository.save(user);
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.profileRepository.findUserByEmail(email);
  }
}
