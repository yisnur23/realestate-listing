import { Injectable } from '@nestjs/common';
import { InsertResult } from 'typeorm';
import { User } from './user.entity';
import { CreateProfileDto } from './profile.dto';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(private profileRepository: ProfileRepository) {}

  async create(createProfileDto: CreateProfileDto): Promise<InsertResult> {
    return await this.profileRepository.insert(createProfileDto);
  }
  async getAll(): Promise<User[]> {
    return await this.profileRepository.find();
  }
}
