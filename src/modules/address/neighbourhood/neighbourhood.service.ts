import { Injectable, NotFoundException } from '@nestjs/common';
import { WoredaService } from '../woreda/woreda.service';
import { CreateNeighbourhoodDto } from './dto/create-neighbourhood.dto';
import { UpdateNeighbourhoodDto } from './dto/update-neighbourhood.dto';
import { NeighbourhoodRepository } from './neighbourhood.repository';

@Injectable()
export class NeighbourhoodService {
  constructor(
    private neighbourhoodRepository: NeighbourhoodRepository,
    private woredaService: WoredaService,
  ) {}
  async create(createSubcityDto: CreateNeighbourhoodDto) {
    const { woreda_id, ...body } = createSubcityDto;
    const woreda = await this.woredaService.findOne(woreda_id);
    this.neighbourhoodRepository.insert({
      ...body,
      woreda,
    });
  }

  findAll(take = 20, skip = 0) {
    return this.neighbourhoodRepository.find({
      take,
      skip,
    });
  }

  async findOne(id: string) {
    const state = await this.neighbourhoodRepository.findById(id);
    if (!state) {
      throw new NotFoundException(`neighbourhood with id ${id} not found`);
    }
    return state;
  }

  async update(id: string, updateNeighbourhoodDto: UpdateNeighbourhoodDto) {
    await this.findOne(id);
    const { woreda_id, ...body } = updateNeighbourhoodDto;
    let update: any = {
      ...body,
    };
    if (woreda_id) {
      const city = await this.woredaService.findOne(woreda_id);
      update = {
        ...update,
        city,
      };
    }
    this.neighbourhoodRepository.update(id, update);
  }

  async remove(id: string) {
    await this.findOne(id);
    this.neighbourhoodRepository.delete(id);
  }
}
