import { Injectable, NotFoundException } from '@nestjs/common';
import { CityService } from '../city/city.service';
import { CreateSubcityDto } from './dto/create-subcity.dto';
import { UpdateSubcityDto } from './dto/update-subcity.dto';
import { SubCityRepository } from './subcity.repository';

@Injectable()
export class SubcityService {
  constructor(
    private subcityRepository: SubCityRepository,
    private cityService: CityService,
  ) {}
  async create(createSubcityDto: CreateSubcityDto) {
    const { city_id, ...body } = createSubcityDto;
    const city = await this.cityService.findOne(city_id);
    this.subcityRepository.insert({
      ...body,
      city,
    });
  }

  findAll(take = 20, skip = 0) {
    return this.subcityRepository.find({
      take,
      skip,
    });
  }

  async findOne(id: string) {
    const state = await this.subcityRepository.findById(id);
    if (!state) {
      throw new NotFoundException(`subcity with id ${id} not found`);
    }
    return state;
  }

  async update(id: string, updateCityDto: UpdateSubcityDto) {
    await this.findOne(id);
    const { city_id, ...body } = updateCityDto;
    let update: any = {
      ...body,
    };
    if (city_id) {
      const city = await this.cityService.findOne(city_id);
      update = {
        ...update,
        city,
      };
    }
    this.subcityRepository.update(id, update);
  }

  async remove(id: string) {
    await this.findOne(id);
    this.subcityRepository.delete(id);
  }
}
