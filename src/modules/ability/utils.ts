import { RequiredRule } from './ability.decorator';
import { Subjects, Action } from './ability.factory';

export const generateAbilityForEntity = (
  entity: Subjects,
): Record<keyof typeof Action, RequiredRule> => {
  return {
    Read: {
      action: Action.Read,
      subject: entity,
    },
    Create: {
      action: Action.Create,
      subject: entity,
    },
    Update: {
      action: Action.Update,
      subject: entity,
    },
    Delete: {
      action: Action.Delete,
      subject: entity,
    },
    Manage: {
      action: Action.Manage,
      subject: entity,
    },
  };
};
