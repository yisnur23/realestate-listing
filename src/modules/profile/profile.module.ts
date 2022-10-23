import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { User } from './user.entity';
import { ProfileRepository } from './profile.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository],
})
export class ProfileModule {}
