import { BaseRepository } from '../classes';

export type MockRepository<T = any> = Partial<
  Record<keyof BaseRepository<T>, jest.Mock>
>;

export const generateMockRepository = <T = any>(): MockRepository<T> => ({
  insert: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});
type BaseService<T = any> = {
  create: () => Promise<void>;
  findAll: () => Promise<T[]>;
  findOne: () => Promise<T>;
  update: () => Promise<void>;
  remove: () => Promise<void>;
};
export type MockService<T = any> = Partial<
  Record<keyof BaseService<T>, jest.Mock>
>;
export const generateMockService = <T = any>(): MockService<T> => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});
