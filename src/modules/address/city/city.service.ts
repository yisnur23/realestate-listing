import { Injectable, NotFoundException } from '@nestjs/common';
import { StateService } from '../state/state.service';
import { CityRepository } from './city.repository';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Injectable()
export class CityService {
  constructor(
    private cityRepository: CityRepository,
    private stateService: StateService,
  ) {}
  async create(createCityDto: CreateCityDto) {
    const { state_id, ...body } = createCityDto;
    const state = await this.stateService.findOne(state_id);
    return this.cityRepository.insert({
      ...body,
      state,
    });
  }

  findAll(take = 20, skip = 0) {
    return this.cityRepository.find({
      take,
      skip,
    });
  }

  async findOne(id: string) {
    const state = await this.cityRepository.findById(id);
    if (!state) {
      throw new NotFoundException(`city with id ${id} not found`);
    }
    return state;
  }

  async update(id: string, updateCityDto: UpdateCityDto) {
    await this.findOne(id);
    const { state_id, ...body } = updateCityDto;
    let update: any = {
      ...body,
    };
    if (state_id) {
      const state = await this.stateService.findOne(state_id);
      update = {
        ...update,
        state,
      };
    }
    return this.cityRepository.update(id, update);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.cityRepository.delete(id);
  }
}
