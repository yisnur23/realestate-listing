import { PartialType } from '@nestjs/mapped-types';
import {
  IsOptional,
  IsPhoneNumber,
  IsUrl,
  Length,
  Matches,
} from 'class-validator';

const telegramLinkRegex =
  /(https?:\/\/)?(www[.])?(telegram|t)\.me\/([a-zA-Z0-9_-]*)\/?$/;

export class CreateProfileDto {
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
  @IsPhoneNumber('ET')
  readonly whatsapp_number: string;
  @IsOptional()
  @IsUrl()
  readonly profile_picture: string;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
