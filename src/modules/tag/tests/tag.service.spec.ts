import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from '../tag.service';
import { TagRepository } from '../tag.repository';
import { NotFoundException } from '@nestjs/common';
import { generateMockRepository, MockRepository } from '../../../common/utils';

describe('TagService', () => {
  let service: TagService;
  let tagRepository: MockRepository;
  const tagId = 'uuid';
  const tagDto = {
    name: 'tag_name',
  };
  const tag = {
    id: tagId,
    ...tagDto,
  };

  beforeEach(async () => {
    const mockTagRepository = generateMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: TagRepository,
          useValue: mockTagRepository,
        },
      ],
    }).compile();

    service = module.get<TagService>(TagService);
    tagRepository = mockTagRepository;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('Create Tag Service', () => {
    it('creates a tag', async () => {
      await service.create(tagDto);
      expect(tagRepository.insert).toBeCalledTimes(1);
      expect(tagRepository.insert).toBeCalledWith(tagDto);
    });
  });
  describe('Find All Tags Service', () => {
    it('finds and returns all tag', async () => {
      tagRepository.find.mockReturnValue([tag]);
      const result = await service.findAll();
      expect(tagRepository.find).toBeCalledTimes(1);
      expect(result).toEqual([tag]);
    });
  });
  describe('Find One Tag Service', () => {
    it('finds and returns a tag', async () => {
      tagRepository.findById.mockReturnValue(tag);
      const result = await service.findOne(tagId);
      expect(tagRepository.findById).toBeCalledTimes(1);
      expect(tagRepository.findById).toBeCalledWith(tagId);
      expect(result).toEqual(tag);
    });
    it('throws a not found exception error if a tag is not found', async () => {
      tagRepository.findById.mockReturnValue(undefined);
      try {
        await service.findOne(tagId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual(`Tag with id ${tagId} not found`);
      }
    });
  });
  describe('Update Tag Service', () => {
    it('updates a tag', async () => {
      await service.update(tagId, tagDto);
      expect(tagRepository.update).toBeCalledTimes(1);
      expect(tagRepository.update).toBeCalledWith(tagId, tagDto);
    });
  });
  describe('Delete Tag Service', () => {
    it('deletes a tag', async () => {
      await service.remove(tagId);
      expect(tagRepository.delete).toBeCalledTimes(1);
      expect(tagRepository.delete).toBeCalledWith(tagId);
    });
  });
});
