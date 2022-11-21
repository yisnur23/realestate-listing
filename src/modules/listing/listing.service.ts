import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Point } from 'geojson';
import { AbilityFactory, Action } from '../ability/ability.factory';

import { CityService } from '../address/city/city.service';
import { ProfileService } from '../profile/profile.service';
import { TagService } from '../tag/tag.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';

import { ListingRepository } from './listing.repository';

@Injectable()
export class ListingService {
  constructor(
    private listingRepository: ListingRepository,
    private tagService: TagService,
    @Inject(forwardRef(() => ProfileService))
    private profileService: ProfileService,
    private cityService: CityService,
    private abilityFactory: AbilityFactory,
  ) {}

  async create(createListingDto: CreateListingDto, userId) {
    const {
      tags: tagsArray,
      city_id,
      longitude,
      latitude,
      ...body
    } = createListingDto;
    const user = await this.profileService.findOne(userId);
    let listingBody: any = {
      ...body,
      user,
    };
    if (city_id) {
      const city = await this.cityService.findOne(city_id);
      listingBody = {
        ...listingBody,
        city,
      };
    }

    if (longitude && latitude) {
      const location: Point = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
      listingBody = {
        ...listingBody,
        location,
      };
    }
    const listing = await this.listingRepository.save(listingBody);

    if (tagsArray?.length) {
      const tags = await this.tagService.findByIds(tagsArray);
      listing.tags = [];
      for (const tag of tags) {
        listing.tags.push(tag);
      }
    }
    this.listingRepository.save(listing);
  }

  findAll(take = 20, skip = 0, filterParams) {
    return this.listingRepository.findMany(take, skip, filterParams);
  }

  async findOne(id: string) {
    const listing = await this.listingRepository.findOne({
      where: { id },
      select: {
        user: {
          id: true,
          display_name: true,
          profile_picture: true,
        },
      },
      relations: {
        user: true,
      },
    });
    if (!listing) {
      throw new NotFoundException(`listing with id ${id} not found`);
    }
    return listing;
  }

  async update(id: string, updateListingDto: UpdateListingDto, user) {
    const ability = this.abilityFactory.defineAbilityFor(user);
    const {
      tags: tagsArray,
      city_id,
      longitude,
      latitude,
      ...body
    } = updateListingDto;
    const listing = await this.findOne(id);
    console.log(listing);
    if (!ability.can(Action.Update, listing)) {
      throw new ForbiddenException('can not update listing');
    }

    let listingBody: any = {
      ...listing,
      ...body,
    };
    if (city_id) {
      const city = await this.cityService.findOne(city_id);
      listingBody = {
        ...listingBody,
        city,
      };
    }

    if (longitude && latitude) {
      const location: Point = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
      listingBody = {
        ...listingBody,
        location,
      };
    }
    if (tagsArray?.length) {
      const tags = await this.tagService.findByIds(tagsArray);
      listingBody = {
        ...listingBody,
        tags,
      };
    }
    this.listingRepository.save(listingBody);
  }

  async remove(id: string, user) {
    const ability = this.abilityFactory.defineAbilityFor(user);
    const listing = await this.findOne(id);
    if (!ability.can(Action.Delete, listing)) {
      throw new ForbiddenException('can not delete listing');
    }
    this.listingRepository.delete(id);
  }
}
