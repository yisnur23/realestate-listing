import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/classes';
import { Listing } from './entities/listing.entity';
import { City } from '../address/city/entities/city.entity';

@Injectable()
export class ListingRepository extends BaseRepository<Listing> {
  constructor(private dataSource: DataSource) {
    super(Listing, dataSource.createEntityManager());
  }
  findMany(take, skip, filter) {
    const query = this.createQueryBuilder('listings');
    query.leftJoinAndSelect('listings.city', 'city');
    query.leftJoinAndSelect('listings.tags', 'tags');
    query.leftJoinAndSelect('listings.mediaItems', 'mediaItems');
    query
      .leftJoinAndSelect('listings.user', 'user')
      .select([
        'listings.id',
        'listings.title',
        'listings.price',
        'listings.number_of_floors',
        'listings.lot_size',
        'listings.total_number_of_rooms',
        'listings.number_of_bath_rooms',
        'listings.number_of_bed_rooms',
        'listings.type',
        'city',
        'tags',
        'mediaItems',
        'user.id',
        'user.display_name',
      ]);

    query.take(take);
    query.skip(skip);
    if (filter) {
      if (filter.price) {
        if (filter.price.lte || filter.price.gte) {
          if (filter.price.gte) {
            query.andWhere('listings.price >= :priceGte', {
              priceGte: filter.price.gte,
            });
          }
          if (filter.price.lte) {
            query.andWhere('listings.price <= :priceLte', {
              priceLte: filter.price.lte,
            });
          }
        } else if (filter.price.eq) {
          query.andWhere('listings.price = :priceEq', {
            priceEq: filter.price.eq,
          });
        }
      }

      if (filter.total_number_of_rooms) {
        if (filter.total_number_of_rooms.gte) {
          query.andWhere('listings.total_number_of_rooms >= :numberOfRooms', {
            numberOfRooms: filter.total_number_of_rooms.gte,
          });
        }
      }

      if (filter.number_of_bath_rooms) {
        if (filter.number_of_bath_rooms.gte) {
          query.andWhere(
            'listings.number_of_bath_rooms >= :numberOfBathRooms',
            {
              numberOfBathRooms: filter.number_of_bath_rooms.gte,
            },
          );
        }
      }

      if (filter.number_of_bed_rooms) {
        if (filter.number_of_bed_rooms.gte) {
          query.andWhere('listings.number_of_bed_rooms >= :numberOfBedRooms', {
            numberOfBedRooms: filter.number_of_bed_rooms.gte,
          });
        }
      }

      if (filter.number_of_floors) {
        if (filter.number_of_floors.gte) {
          query.andWhere('listings.price >= :numberOfFloors', {
            numberOfFloors: filter.number_of_floors.gte,
          });
        }
      }

      if (filter.lot_size) {
        if (filter.lot_size.lte || filter.lot_size.gte) {
          if (filter.lot_size.gte) {
            query.andWhere('listings.lot_size >= :lotSizeGte', {
              lotSizeGte: filter.price.gte,
            });
          }
          if (filter.lot_size.lte) {
            query.andWhere('listings.lot_size <= :lotSizeLte', {
              lotSizeLte: filter.lot_size.lte,
            });
          }
        } else if (filter.lot_size.eq) {
          query.andWhere('listings.lot_size = :lotSizeEq', {
            lotSizeEq: filter.lot_size.eq,
          });
        }
      }
      if (filter.year_built) {
        if (filter.year_built.lte || filter.year_built.gte) {
          if (filter.year_built.gte) {
            query.andWhere('listings.year_built >= :yearBuiltGte', {
              yearBuiltGte: filter.year_built.gte,
            });
          }
          if (filter.year_built.lte) {
            query.andWhere('listings.year_built <= :yearBuiltLte', {
              yearBuiltLte: filter.year_built.lte,
            });
          }
        } else if (filter.year_built.eq) {
          query.andWhere('listings.year_built = :yearBuiltEq', {
            yearBuiltEq: filter.year_built.eq,
          });
        }
      }
    }

    if (filter.type) {
      query.andWhere('listings.type = :type', {
        type: filter.type,
      });
    }
    if (filter.city_id) {
      query.andWhere('listings.city.id = :cityId', { cityId: filter.city_id });
    } else if (filter.state_id) {
      query
        .andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select('city.id')
            .from(City, 'city')
            .where('city.state.id = :stateId')
            .getQuery();
          return 'listings.city.id IN ' + subQuery;
        })
        .setParameter('stateId', filter.state_id);
    }

    if (filter.tags) {
      const tags = !Array.isArray(filter.tags) ? [filter.tags] : filter.tags;

      query.andWhere('tags.id IN (:...tags)', { tags });
    }

    if (filter.orderBy) {
      if (filter.orderBy === 'ASC') {
        query.orderBy('listings.createdDate', 'ASC');
      } else if (filter.orderBy === 'DESC') {
        query.orderBy('listings.createdDate', 'DESC');
      }
    }

    if (filter.radius && filter.longitude && filter.latitude) {
      const radius = filter.radius * 1000;
      query.andWhere(
        `ST_DWithin(listings.location, ST_MakePoint(${filter.longitude},${filter.latitude})::geography, ${radius})`,
      );
    }

    if (filter.s) {
      query.andWhere('listings.document @@ plainto_tsquery(:query)', {
        query: filter.s,
      });
    }
    return query.getMany();
  }
}
