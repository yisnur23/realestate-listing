import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { permittedFieldsOf } from '@casl/ability/extra';
import { AbilityFactory, Action } from '../ability/ability.factory';
import { CreateProfileDto } from './dto/profile.dto';
import { User } from './entities/user.entity';
import { ProfileRepository } from './profile.repository';
import { pick } from '../../common/utils';
import { ListingService } from '../listing/listing.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class ProfileService {
  private USER_FIELDS = [
    'id',
    'first_name',
    'last_name',
    'display_name',
    'email',
    'role',
    'phone',
    'is_verified',
    'telegram_link',
    'profile_picture',
  ];

  constructor(
    private profileRepository: ProfileRepository,
    private abilityFactory: AbilityFactory,
    @Inject(forwardRef(() => ListingService))
    private listingService: ListingService,
  ) {}

  async createUser(user: CreateProfileDto) {
    return this.profileRepository.save(user);
  }

  async findOne(id: string) {
    const user = await this.profileRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`user with id ${id} not found`);
    }
    return user;
  }

  async getUser(id: string, user: User) {
    const profile = await this.findOne(id);
    const ability = this.abilityFactory.defineAbilityFor(user);
    const options = { fieldsFrom: (rule) => rule.fields || this.USER_FIELDS };

    const allowedFields = permittedFieldsOf(
      ability,
      Action.Read,
      profile,
      options,
    );
    const filteredProfile = pick(profile, allowedFields);
    return filteredProfile;
  }

  async updateProfile(user: User, update) {
    const profile = await this.findOne(user.id);
    const ability = this.abilityFactory.defineAbilityFor(user);
    const options = { fieldsFrom: (rule) => rule.fields || this.USER_FIELDS };

    const allowedFields = permittedFieldsOf(
      ability,
      Action.Update,
      profile,
      options,
    );
    const filteredUpdate = pick(update, allowedFields);

    this.profileRepository.update(user.id, filteredUpdate);
  }

  async deleteProfile(user: User) {
    const profile = await this.findOne(user.id);
    const ability = this.abilityFactory.defineAbilityFor(user);

    if (!ability.can(Action.Delete, profile)) {
      throw new ForbiddenException();
    }
    this.profileRepository.delete(user.id);
  }

  findUserByEmail(email: string): Promise<User> {
    return this.profileRepository.findUserByEmail(email);
  }

  async addFavoriteListing(listingId: string, userId: string) {
    const profile = await this.findOne(userId);
    const listing = await this.listingService.findOne(listingId);
    if (!profile.favorites) {
      profile.favorites = [];
    }
    profile.favorites.push(listing);
    this.profileRepository.save(profile);
  }
  async removeFavoriteListing(listingId: string, userId: string) {
    const profile = await this.findOne(userId);
    if (!profile.favorites) {
      profile.favorites = [];
    }
    profile.favorites.filter((listing) => listing.id !== listingId);
    this.profileRepository.save(profile);
  }
}
