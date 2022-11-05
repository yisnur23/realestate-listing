import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StateDto } from './dto/create-state.dto';
import { StateRepository } from './state.repository';

@Injectable()
export class StateService {
  constructor(private stateRepository: StateRepository) {}
  async create(createStateDto: StateDto) {
    const state = await this.stateRepository.findOneByName(createStateDto.name);
    if (state) {
      throw new ConflictException(
        `state name ${createStateDto.name} already exists.`,
      );
    }
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
    const toBeUpdated = await this.findOne(id);
    const stateByName = await this.stateRepository.findOneByName(
      updateStateDto.name,
    );
    if (stateByName) {
      if (stateByName.id !== toBeUpdated.id)
        throw new ConflictException(
          `state name ${updateStateDto.name} already exists.`,
        );
    }
    await this.findOne(id);
    return this.stateRepository.update(id, updateStateDto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.stateRepository.delete(id);
  }
}
