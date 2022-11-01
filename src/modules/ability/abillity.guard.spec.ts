import { Test, TestingModule } from '@nestjs/testing';
import { AbilitiesGuard } from './ability.guard';
import { ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { AbilityFactory } from './ability.factory';
import { Reflector } from '@nestjs/core';

describe('AbilitiesGuard', () => {
  let abilityGuard: AbilitiesGuard;
  let mockAbilityFactor: AbilityFactory;
  let reflector: Reflector;
  beforeEach(async () => {
    reflector = createMock<Reflector>(Reflector);
    mockAbilityFactor = createMock<AbilityFactory>();
    abilityGuard = new AbilitiesGuard(reflector, mockAbilityFactor);
  });
});
