import { Injectable, NotFoundException } from '@nestjs/common';
import { StateDto } from './dto/create-state.dto';
import { StateRepository } from './state.repository';

@Injectable()
export class StateService {
  constructor(private stateRepository: StateRepository) {}
  create(createStateDto: StateDto) {
    return this.stateRepository.insert(createStateDto);
  }

  findAll(take = 20, skip = 0) {
    return this.stateRepository.find({
      take,
      skip,
    });
  }

  async findOne(id: string) {
    const state = await this.stateRepository.findById(id);
    if (!state) {
      throw new NotFoundException(`state with id ${id} not found`);
    }
    return state;
  }

  async update(id: string, updateStateDto: StateDto) {
    await this.findOne(id);
    return this.stateRepository.update(id, updateStateDto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.stateRepository.delete(id);
  }
}
