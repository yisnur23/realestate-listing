import { generateAbilityForEntity } from '../ability/utils';
import { User } from './entities/user.entity';

export const UserAbility = generateAbilityForEntity(User);
