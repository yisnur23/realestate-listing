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
import { Public } from '../auth/auth.decorator'
import { MediaItemService } from './media-item.service';
import { CreateMediaItemDto } from './dto/create-media-item.dto';
import { UpdateMediaItemDto } from './dto/update-media-item.dto';

@Controller('media-item')
export class MediaItemController {
  constructor(private readonly mediaItemService: MediaItemService) {}

  @Get('signed-url')
  @Public()
  generateSignedUrl(){
    return this.mediaItemService.generateSignedUrl();
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMediaItemDto: UpdateMediaItemDto,
  ) {
    return this.mediaItemService.update(id, updateMediaItemDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.mediaItemService.remove(id);
  }
}
