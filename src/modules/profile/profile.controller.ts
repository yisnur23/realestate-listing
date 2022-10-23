import { Body, Controller, Post, Get } from '@nestjs/common';
import { CreateProfileDto } from './dto/profile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post()
  async createProfile(@Body() body: CreateProfileDto) {
    return await this.profileService.create(body);
  }
  @Get()
  async getAll() {
    return await this.profileService.getAll();
  }
}
