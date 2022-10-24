import { Test, TestingModule } from '@nestjs/testing';
import { generateMockService, MockService } from '../../../common/utils';
import { TagController } from '../tag.controller';
import { TagService } from '../tag.service';

describe('TagController', () => {
  let controller: TagController;
  let tagService: MockService;
  const tagId = 'uuid';
  const tagDto = {
    name: 'tag_name',
  };
  const tag = {
    id: tagId,
    ...tagDto,
  };

  beforeEach(async () => {
    const mockTagService = generateMockService();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [{ provide: TagService, useValue: mockTagService }],
    }).compile();

    controller = module.get<TagController>(TagController);
    tagService = mockTagService;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create Tag Controller', () => {
    it('creates a tag', async () => {
      tagService.create.mockReturnValue(tag);
      const returnedValue = await controller.create(tagDto);
      expect(tagService.create).toBeCalledTimes(1);
      expect(tagService.create).toBeCalledWith(tagDto);
      expect(returnedValue).toEqual({
        id: tagId,
        ...tagDto,
      });
    });
  });
  describe('Find All Tags Controller', () => {
    it('returns all tags', async () => {
      tagService.findAll.mockReturnValue([tag]);
      const returnedValue = await controller.findAll();
      expect(tagService.findAll).toBeCalledTimes(1);

      expect(returnedValue).toEqual([tag]);
    });
  });
  describe('Find One Tag Controller', () => {
    it('returns one tag', async () => {
      tagService.findOne.mockReturnValue(tag);
      const returnedValue = await controller.findOne(tagId);
      expect(tagService.findOne).toBeCalledTimes(1);
      expect(tagService.findOne).toBeCalledWith(tagId);
      expect(returnedValue).toEqual(tag);
    });
  });
  describe('Update Tag Controller', () => {
    it('udpates a tag', async () => {
      await controller.update(tagId, tagDto);
      expect(tagService.update).toBeCalledTimes(1);
      expect(tagService.update).toBeCalledWith(tagId, tagDto);
    });
  });
  describe('Delete Tag Controller', () => {
    it('deletes a tag', async () => {
      await controller.remove(tagId);
      expect(tagService.remove).toBeCalledTimes(1);
      expect(tagService.remove).toBeCalledWith(tagId);
    });
  });
});
