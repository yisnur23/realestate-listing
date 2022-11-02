import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC } from '../auth/auth.decorator';
import { CHECK_ABILITY, RequiredRule } from './ability.decorator';
import { AbilityFactory } from './ability.factory';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC,
      context.getHandler(),
    );
    const rules = this.reflector.get<RequiredRule[]>(
      CHECK_ABILITY,
      context.getHandler(),
    );
    if (isPublic && !rules) return true;

    const { user } = context.switchToHttp().getRequest();

    const ability = this.abilityFactory.defineAbilityFor(user);

    return !!rules?.some((rule) => ability.can(rule.action, rule.subject));
  }
}
