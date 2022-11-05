import { Injectable, NotFoundException } from '@nestjs/common';
import { CityService } from '../city/city.service';
import { SubcityService } from '../subcity/subcity.service';
import { CreateWoredaDto } from './dto/create-woreda.dto';
import { UpdateWoredaDto } from './dto/update-woreda.dto';
import { WoredaRepository } from './woreda.repository';

@Injectable()
export class WoredaService {
  constructor(
    private wordaRepository: WoredaRepository,
    private subCityService: SubcityService,
    private cityService: CityService,
  ) {}
  async create(createWoredaDto: CreateWoredaDto) {
    const { city_id, subcity_id, ...body } = createWoredaDto;
    let woredaBody: any = {
      ...body,
    };
    if (city_id) {
      const city = await this.cityService.findOne(city_id);
      woredaBody = {
        ...woredaBody,
        city,
      };
    } else if (subcity_id) {
      const subcity = await this.subCityService.findOne(subcity_id);
      woredaBody = {
        ...woredaBody,
        subcity,
      };
    }

    return this.wordaRepository.insert(woredaBody);
  }

  findAll(take = 20, skip = 0) {
    return this.wordaRepository.find({
      take,
      skip,
    });
  }

  async findOne(id: string) {
    const woreda = await this.wordaRepository.findById(id);
    if (!woreda) {
      throw new NotFoundException(`woreda with id ${id} not found`);
    }
    return woreda;
  }

  async update(id: string, updateWoredaDto: UpdateWoredaDto) {
    const { city_id, subcity_id, ...body } = updateWoredaDto;
    let woredaBody: any = {
      ...body,
    };
    if (city_id) {
      const city = await this.cityService.findOne(city_id);
      woredaBody = {
        ...woredaBody,
        city,
      };
    } else if (subcity_id) {
      const subcity = await this.subCityService.findOne(subcity_id);
      woredaBody = {
        ...woredaBody,
        subcity,
      };
    }

    return this.wordaRepository.insert(woredaBody);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.wordaRepository.delete(id);
  }
}
