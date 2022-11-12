import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { User } from './entities/user.entity';
import { ProfileRepository } from './profile.repository';
import { AbilityModule } from '../ability/ability.module';
import { ListingModule } from '../listing/listing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AbilityModule,
    forwardRef(() => ListingModule),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository],
  exports: [ProfileService],
})
export class ProfileModule {}
