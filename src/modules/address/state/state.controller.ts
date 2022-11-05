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
import { StateService } from './state.service';
import { StateDto } from './dto/create-state.dto';
import { CheckAbilities } from '../../ability/ability.decorator';
import { StateAbility } from './state.abilities';
import { Public } from '../../auth/auth.decorator';

@Controller('')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Post()
  @CheckAbilities(StateAbility.Create)
  create(@Body() createStateDto: StateDto) {
    return this.stateService.create(createStateDto);
  }

  @Get()
  @Public()
  @CheckAbilities(StateAbility.Read)
  findAll(@Query('take') take: number, @Query('skip') skip: number) {
    return this.stateService.findAll(take, skip);
  }

  @Get(':id')
  @Public()
  @CheckAbilities(StateAbility.Read)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.stateService.findOne(id);
  }

  @Patch(':id')
  @CheckAbilities(StateAbility.Update)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStateDto: StateDto,
  ) {
    return this.stateService.update(id, updateStateDto);
  }

  @Delete(':id')
  @CheckAbilities(StateAbility.Delete)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.stateService.remove(id);
  }
}
