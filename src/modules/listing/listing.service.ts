import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Point } from 'geojson';

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
  ) {}

  async create(
    createListingDto: CreateListingDto,
    userId = '2e520ad7-274b-4ff8-a498-198329a023ce',
  ) {
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
    const listing = await this.listingRepository.findById(id);
    if (!listing) {
      throw new NotFoundException(`listing with id ${id} not found`);
    }
    return listing;
  }

  async update(id: string, updateListingDto: UpdateListingDto) {
    const {
      tags: tagsArray,
      city_id,
      longitude,
      latitude,
      ...body
    } = updateListingDto;
    const listing = await this.findOne(id);

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

  async remove(id: string) {
    await this.findOne(id);
    this.listingRepository.delete(id);
  }
}
