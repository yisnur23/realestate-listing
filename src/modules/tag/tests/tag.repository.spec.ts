import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { TagRepository } from '../tag.repository';

describe('TagRepository', () => {
  let tagRepository: TagRepository;
  const mockDataSource = {
    createEntityManager: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagRepository,
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();
    tagRepository = module.get<TagRepository>(TagRepository);
  });
  it('should be defined', () => {
    console.log(tagRepository);
    expect(tagRepository).toBeDefined();
  });

  describe('findOneByName', () => {
    it('calls findOneBy method passing in name', async () => {
      const name = 'tag_name';
      tagRepository.findOneBy = jest.fn();

      await tagRepository.findOneByName(name);

      expect(tagRepository.findOneBy).toBeCalledWith({ name });
      expect(tagRepository.findOneBy).toBeCalledTimes(1);
    });
  });
});
