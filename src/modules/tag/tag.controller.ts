import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/auth.decorator';
import { CheckAbilities } from '../ability/ability.decorator';
import { TagAbility } from './tag.ablilities';

@ApiTags('tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @CheckAbilities(TagAbility.Create)
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Get()
  @Public()
  findAll(@Query('take') take: number, @Query('skip') skip: number) {
    return this.tagService.findAll(take, skip);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tagService.findOne(id);
  }

  @Patch(':id')
  @CheckAbilities(TagAbility.Update)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagService.update(id, updateTagDto);
  }

  @Delete(':id')
  @CheckAbilities(TagAbility.Delete)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tagService.remove(id);
  }
}
