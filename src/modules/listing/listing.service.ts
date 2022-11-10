import { Injectable, NotFoundException } from '@nestjs/common';
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
    private profileService: ProfileService,
    private neighbourhoodService: NeighbourhoodService,
  ) {}
  async create(createListingDto: CreateListingDto, userId) {
    const { tags: tagsArray, ...body } = createListingDto;
    const user = await this.profileService.findOne(userId);
    const listing = await this.listingRepository.save({
      ...body,
      user,
    });
    if (tagsArray?.length) {
      const tags = await this.tagService.findByIds(tagsArray);
      listing.tags = tags;
      this.listingRepository.save(listing);
    }
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
    const { tags: tagsArray, ...body } = updateListingDto;
    let update: any = {
      ...body,
    };
    await this.findOne(id);
    if (tagsArray?.length) {
      const tags = await this.tagService.findByIds(tagsArray);
      update = {
        ...update,
        tags,
      };
    }
    this.listingRepository.update(id, update);
  }

  async remove(id: string) {
    await this.findOne(id);
    this.listingRepository.delete(id);
  }
}