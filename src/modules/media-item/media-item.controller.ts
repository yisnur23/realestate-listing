import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Public } from '../auth/auth.decorator';
import { MediaItemService } from './media-item.service';
import { CheckAbilities } from '../ability/ability.decorator';
import { CreateMediaItemDto } from './dto/create-media-item.dto';
import { UpdateMediaItemDto } from './dto/update-media-item.dto';
import { ListingAbility } from '../listing/listing.abilities';

@Controller('media-item')
export class MediaItemController {
  constructor(private readonly mediaItemService: MediaItemService) {}

  @Get('signed-url')
  @CheckAbilities(ListingAbility.Create)
  generateSignedUrl() {
    return this.mediaItemService.generateSignedUrl();
  }
}
