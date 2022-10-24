import { Repository, ObjectLiteral } from 'typeorm';

export abstract class BaseRepository<
  T extends ObjectLiteral,
> extends Repository<T> {
  findById(id: string) {
    return this.createQueryBuilder().select().where({ id }).getOne();
  }
}
