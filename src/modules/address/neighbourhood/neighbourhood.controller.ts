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
import { NeighbourhoodService } from './neighbourhood.service';
import { CreateNeighbourhoodDto } from './dto/create-neighbourhood.dto';
import { UpdateNeighbourhoodDto } from './dto/update-neighbourhood.dto';

@Controller('')
export class NeighbourhoodController {
  constructor(private readonly neighbourhoodService: NeighbourhoodService) {}

  @Post()
  create(@Body() createNeighbourhoodDto: CreateNeighbourhoodDto) {
    return this.neighbourhoodService.create(createNeighbourhoodDto);
  }

  @Get()
  findAll(@Query('take') take: number, @Query('skip') skip: number) {
    return this.neighbourhoodService.findAll(take, skip);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.neighbourhoodService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateNeighbourhoodDto: UpdateNeighbourhoodDto,
  ) {
    return this.neighbourhoodService.update(id, updateNeighbourhoodDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.neighbourhoodService.remove(id);
  }
}
