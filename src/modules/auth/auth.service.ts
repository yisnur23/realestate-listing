import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProfileRepository } from '../profile/profile.repository';
import querystring from 'querystring';
import axios from 'axios';
import { GoogleConfig } from '../../config';
import { SignUpMethod } from '../profile/entities/user.entity';

@Injectable()
export class AuthService {
  private googleConfig: GoogleConfig;

  constructor(
    private profileRepository: ProfileRepository,
    private configService: ConfigService,
  ) {
    this.googleConfig = this.configService.get<GoogleConfig>('google');
  }

  getGoogleAuthUrl(): string {
    const rootUrl = this.googleConfig.rootUrl;
    const options = {
      redirect_uri: this.googleConfig.redirectUrl,
      client_id: this.googleConfig.clientId,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
    };
    return `${rootUrl}?${querystring.stringify(options)}`;
  }

  async googleRedirect(code: string, session) {
    const { id_token, access_token } = await this.getTokens(code);

    const googleProfile = await axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        },
      )
      .then((res) => res.data);

    if (googleProfile.verified_email) {
      let user;
      user = await this.profileRepository.findByEmail(googleProfile.email);
      if (user) {
        return user;
      }
      await this.profileRepository.insert({
        first_name: googleProfile.given_name,
        last_name: googleProfile.family_name,
        email: googleProfile.email,
        profile_picture: googleProfile.picture,
        sign_up_method: SignUpMethod.GOOGLE,
        is_verified: true,
      });
      user = await this.profileRepository.findByEmail(googleProfile.email);
      session.email = user.email;
      return user;
    }
  }

  async getTokens(code: string) {
    const url = 'https://oauth2.googleapis.com/token';
    const values = {
      code,
      client_id: this.googleConfig.clientId,
      client_secret: this.googleConfig.clientSecret,
      redirect_uri: this.googleConfig.redirectUrl,
      grant_type: 'authorization_code',
    };

    const response = await axios.post(url, querystring.stringify(values));
    return response.data;
  }
  listUsers() {
    return this.profileRepository.find();
  }
}
