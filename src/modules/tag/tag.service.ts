import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagRepository } from './tag.repository';

@Injectable()
export class TagService {
  constructor(private tagRepository: TagRepository) {}

  async create(createTagDto: CreateTagDto) {
    const tag = await this.tagRepository.findOneByName(createTagDto.name);
    if (tag) {
      throw new ConflictException(
        `tag name ${createTagDto.name} already exists.`,
      );
    }
    await this.tagRepository.insert(createTagDto);
  }

  findAll() {
    return this.tagRepository.find();
  }

  async findOne(id: string) {
    const tag = await this.tagRepository.findById(id);
    if (!tag) {
      throw new NotFoundException(`tag with id ${id} not found`);
    }
    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const toBeUpdated = await this.findOne(id);
    const tagByName = await this.tagRepository.findOneByName(updateTagDto.name);
    if (tagByName) {
      if (tagByName.id !== toBeUpdated.id)
        throw new ConflictException(
          `tag name ${updateTagDto.name} already exists.`,
        );
    }
    await this.tagRepository.update(id, updateTagDto);
  }

  async remove(id: string) {
    await this.tagRepository.delete(id);
  }
}
