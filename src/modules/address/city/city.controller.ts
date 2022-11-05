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
import { CheckAbilities } from '../../ability/ability.decorator';
import { Public } from '../../auth/auth.decorator';
import { CityAbility } from './city.abilities';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Controller('')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  @CheckAbilities(CityAbility.Create)
  create(@Body() createCityDto: CreateCityDto) {
    return this.cityService.create(createCityDto);
  }

  @Get()
  @Public()
  @CheckAbilities(CityAbility.Read)
  findAll(@Query('take') take: number, @Query('skip') skip: number) {
    return this.cityService.findAll(take, skip);
  }

  @Get(':id')
  @Public()
  @CheckAbilities(CityAbility.Read)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cityService.findOne(id);
  }

  @Patch(':id')
  @CheckAbilities(CityAbility.Update)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCityDto: UpdateCityDto,
  ) {
    return this.cityService.update(id, updateCityDto);
  }

  @Delete(':id')
  @CheckAbilities(CityAbility.Delete)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cityService.remove(id);
  }
}
