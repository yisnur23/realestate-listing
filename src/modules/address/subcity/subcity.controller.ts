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
import { SubcityService } from './subcity.service';
import { CreateSubcityDto } from './dto/create-subcity.dto';
import { UpdateSubcityDto } from './dto/update-subcity.dto';

@Controller('')
export class SubcityController {
  constructor(private readonly subcityService: SubcityService) {}

  @Post()
  create(@Body() createSubcityDto: CreateSubcityDto) {
    return this.subcityService.create(createSubcityDto);
  }

  @Get()
  findAll(@Query('take') take: number, @Query('skip') skip: number) {
    return this.subcityService.findAll(take, skip);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.subcityService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSubcityDto: UpdateSubcityDto,
  ) {
    return this.subcityService.update(id, updateSubcityDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.subcityService.remove(id);
  }
}
