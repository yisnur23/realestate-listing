import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Req,
} from '@nestjs/common';
import { CheckAbilities } from '../ability/ability.decorator';
import { Public } from '../auth/auth.decorator';
import { UpdateProfileDto } from './dto/profile.dto';

import { ProfileService } from './profile.service';
import { UserAbility } from './user.abilities';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('me')
  @CheckAbilities(UserAbility.Read)
  getProfile(@Req() req) {
    const user = req.user;
    return this.profileService.getUser(user.id, user);
  }

  @Patch('me')
  @CheckAbilities(UserAbility.Update)
  updateProfile(@Req() req, @Body() update: UpdateProfileDto) {
    const user = req.user;
    return this.profileService.updateProfile(user, update);
  }

  @Delete('me')
  @CheckAbilities(UserAbility.Delete)
  deleteProfile(@Req() req) {
    const user = req.user;
    return this.profileService.deleteProfile(user);
  }

  @Get(':id')
  @CheckAbilities(UserAbility.Read)
  @Public()
  getUser(@Req() req, @Param('id', ParseUUIDPipe) id) {
    const user = req.user;
    return this.profileService.getUser(id, user);
  }
}
