import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { City } from '../address/city/entities/city.entity';
import { State } from '../address/state/entities/state.entity';
import { Listing } from '../listing/entities/listing.entity';
import { User, UserRole } from '../profile/entities/user.entity';
import { Tag } from '../tag/entities/tag.entity';

export enum Action {
  Manage = 'manage',
  Read = 'read',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects =
  | InferSubjects<typeof User>
  | InferSubjects<typeof Tag>
  | InferSubjects<typeof Listing>
  | InferSubjects<typeof State>
  | InferSubjects<typeof City>
  | 'all';

type FlatListing = Listing & {
  'user.id': Listing['user']['id'];
};
export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbilityFor(user: User) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    if (user?.role === UserRole.ADMIN) {
      can(Action.Manage, 'all');
    } else if (user?.role === UserRole.USER) {
      can(Action.Manage, User, { id: { $eq: user.id } });
      can(Action.Create, Listing);
      can(Action.Read, Listing);
      can<FlatListing>(Action.Manage, Listing, { 'user.id': user.id });
      cannot(Action.Read, User, ['role'], { id: { $eq: user.id } });
      cannot(Action.Update, User, ['role', 'is_verified'], {
        id: { $eq: user.id },
      });
    } else {
      can(Action.Read, 'all');
      cannot(Action.Read, User, ['email', 'last_name', 'role']);
    }
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
