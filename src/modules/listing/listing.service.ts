import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Point } from 'geojson';

import { NeighbourhoodService } from '../address/neighbourhood/neighbourhood.service';
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
    private neighbourhoodService: NeighbourhoodService,
  ) {}

  async create(createListingDto: CreateListingDto, userId) {
    const {
      tags: tagsArray,
      neighbourhood_id,
      longitude,
      latitude,
      ...body
    } = createListingDto;
    const user = await this.profileService.findOne(userId);
    let listingBody: any = {
      ...body,
      user,
    };
    if (neighbourhood_id) {
      const neighbourhood = await this.neighbourhoodService.findOne(
        neighbourhood_id,
      );
      listingBody = {
        ...listingBody,
        neighbourhood,
      };
    }
    if (tagsArray?.length) {
      const tags = await this.tagService.findByIds(tagsArray);
      listingBody = {
        ...listingBody,
        tags,
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
    this.listingRepository.insert(listingBody);
  }

  findAll(take = 20, skip = 0) {
    return this.listingRepository.find({
      take,
      skip,
    });
  }

  async findOne(id: string) {
    const listing = await this.listingRepository.findById(id);
    if (!listing) {
      throw new NotFoundException(`user with id ${id} not found`);
    }
    return listing;
  }

  async update(id: string, updateListingDto: UpdateListingDto) {
    const {
      tags: tagsArray,
      neighbourhood_id,
      longitude,
      latitude,
      ...body
    } = updateListingDto;
    await this.findOne(id);

    let listingBody: any = {
      ...body,
    };
    if (neighbourhood_id) {
      const neighbourhood = await this.neighbourhoodService.findOne(
        neighbourhood_id,
      );
      listingBody = {
        ...listingBody,
        neighbourhood,
      };
    }
    if (tagsArray?.length) {
      const tags = await this.tagService.findByIds(tagsArray);
      listingBody = {
        ...listingBody,
        tags,
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
    this.listingRepository.update(id, listingBody);
  }

  async remove(id: string) {
    await this.findOne(id);
    this.listingRepository.delete(id);
  }
}
