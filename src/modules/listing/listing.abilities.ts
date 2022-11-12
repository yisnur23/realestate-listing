import { generateAbilityForEntity } from '../ability/utils';
import { Listing } from './entities/listing.entity';

export const ListingAbility = generateAbilityForEntity(Listing);
