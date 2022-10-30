import { Injectable } from '@nestjs/common';
import { Profile } from 'passport-google-oauth20';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class AuthService {
  constructor(private profileService: ProfileService) {}

  findOrCreateUser(profile: Profile) {
    const email = profile.emails[0].value;
    let user = this.profileService.findUserByEmail(email);
    if (!user) {
      user = this.profileService.createUser({
        email,
        display_name: profile.displayName,
        first_name: profile?.name.givenName,
        last_name: profile?.name.familyName,
        profile_picture: profile.photos[0].value,
      });
    }
    return user;
  }
}
