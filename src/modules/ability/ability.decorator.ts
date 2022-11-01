import { SetMetadata } from '@nestjs/common';
import { Subjects, Action } from './ability.factory';

export const CHECK_ABILITY = 'check_ability';

export interface RequiredRule {
  action: Action;
  subject: Subjects;
}

export const CheckAbilities = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY, requirements);
