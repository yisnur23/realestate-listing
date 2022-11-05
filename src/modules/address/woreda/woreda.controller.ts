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
import { WoredaService } from './woreda.service';
import { CreateWoredaDto } from './dto/create-woreda.dto';
import { UpdateWoredaDto } from './dto/update-woreda.dto';

@Controller('')
export class WoredaController {
  constructor(private readonly woredaService: WoredaService) {}

  @Post()
  create(@Body() createWoredaDto: CreateWoredaDto) {
    return this.woredaService.create(createWoredaDto);
  }

  @Get()
  findAll(@Query('take') take: number, @Query('skip') skip: number) {
    return this.woredaService.findAll(take, skip);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.woredaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWoredaDto: UpdateWoredaDto,
  ) {
    return this.woredaService.update(id, updateWoredaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.woredaService.remove(id);
  }
}
