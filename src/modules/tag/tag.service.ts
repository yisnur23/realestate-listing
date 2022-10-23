import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagRepository } from './tag.repository';

@Injectable()
export class TagService {
  constructor(private tagRepository: TagRepository) {}

  create(createTagDto: CreateTagDto) {
    return this.tagRepository.insert(createTagDto);
  }

  findAll() {
    return this.tagRepository.find();
  }

  findOne(id: string) {
    return this.tagRepository.findOne({
      where: {
        id,
      },
    });
  }

  update(id: string, updateTagDto: UpdateTagDto) {
    return this.tagRepository.update(id, updateTagDto);
  }

  remove(id: number) {
    return this.tagRepository.delete(id);
  }
}
