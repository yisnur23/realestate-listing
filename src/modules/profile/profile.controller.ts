import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
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

  @Post('me/favorites')
  @CheckAbilities(UserAbility.Update)
  addFavoriteListing(@Req() req, @Body('listingId') listingId: string) {
    const user = req.user;
    return this.profileService.addFavoriteListing(listingId, user.id);
  }

  @Delete('me/favorites/:listingId')
  @CheckAbilities(UserAbility.Update)
  removeFavoriteListing(
    @Req() req,
    @Param('listingId', ParseUUIDPipe) listingId: string,
  ) {
    const user = req.user;
    return this.profileService.removeFavoriteListing(listingId, user.id);
  }

  @Get(':id')
  @Public()
  @CheckAbilities(UserAbility.Read)
  getUser(@Req() req, @Param('id', ParseUUIDPipe) id) {
    const user = req.user;
    return this.profileService.getUser(id, user);
  }
}
