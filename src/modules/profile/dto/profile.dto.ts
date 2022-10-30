import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsUrl, Length, Matches } from 'class-validator';

const telegramLinkRegex =
  /(https?:\/\/)?(www[.])?(telegram|t)\.me\/([a-zA-Z0-9_-]*)\/?$/;

export class ProfileDto {
  @Length(2, 50)
  readonly first_name: string;

  @Length(2, 50)
  readonly last_name: string;
  @IsOptional()
  @Matches(telegramLinkRegex, {
    message: 'telegram link must be a proper telegram url',
  })
  readonly telegram_link: string;
  @IsOptional()
  @IsUrl()
  readonly profile_picture: string;
}

export class UpdateProfileDto extends PartialType(ProfileDto) {}

export class CreateProfileDto {
  readonly email: string;
  readonly display_name: string;
  readonly first_name?: string;
  readonly last_name?: string;
  readonly profile_picture?: string;
}
