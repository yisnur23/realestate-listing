import { Test, TestingModule } from '@nestjs/testing';
import { AbilitiesGuard } from './ability.guard';
import { ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { AbilityFactory } from './ability.factory';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC } from '../auth/auth.decorator';
import { CHECK_ABILITY } from './ability.decorator';
import { UserAbility } from '../profile/user.abilities';
import { User } from '../profile/entities/user.entity';

describe('AbilitiesGuard', () => {
  let abilitiesGuard: AbilitiesGuard;
  let abilityFactory: AbilityFactory;
  let reflector: Reflector;

  beforeEach(async () => {
    const mockReflector = createMock<Reflector>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AbilitiesGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
        {
          provide: AbilityFactory,
          useValue: {
            defineAbilityFor: jest.fn().mockReturnValue({
              can: jest.fn().mockReturnValue(true),
              cannot: jest.fn(),
            }),
          },
        },
      ],
    }).compile();
    abilitiesGuard = module.get<AbilitiesGuard>(AbilitiesGuard);
    reflector = module.get<Reflector>(Reflector);
    abilityFactory = module.get<AbilityFactory>(AbilityFactory);
  });

  it('allows handler to be executed if it is public and rules are not defined', () => {
    // eslint-disable-next-line
    jest.spyOn(reflector, 'get').mockImplementation((key, arg2) => {
      if (key === IS_PUBLIC) return true;
      if (key === CHECK_ABILITY) return undefined;
    });
    const mockExecutionContext = createMock<ExecutionContext>();

    const returnedValue = abilitiesGuard.canActivate(mockExecutionContext);
    expect(reflector.get).toBeCalledTimes(2);
    expect(returnedValue).toBe(true);
  });
  it('returns false if handler is not public and rules are not found', () => {
    const user = {
      id: 'user_id',
    };
    // eslint-disable-next-line
    jest.spyOn(reflector, 'get').mockImplementation((key, arg2) => {
      if (key === IS_PUBLIC) return false;
      if (key === CHECK_ABILITY) return undefined;
    });
    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          user,
        }),
      }),
    });

    const returnedValue = abilitiesGuard.canActivate(mockExecutionContext);
    expect(reflector.get).toBeCalledTimes(2);
    expect(abilityFactory.defineAbilityFor).toBeCalledTimes(1);
    expect(abilityFactory.defineAbilityFor).toBeCalledWith(user);
    expect(returnedValue).toBe(false);
  });
  it('calls casl ablility if rules are defined and handler is not public', () => {
    const user = {
      id: 'user_id',
    } as User;
    // eslint-disable-next-line
    jest.spyOn(reflector, 'get').mockImplementation((key, arg2) => {
      if (key === IS_PUBLIC) return false;
      if (key === CHECK_ABILITY) return [UserAbility.Read];
    });

    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          user,
        }),
      }),
    });

    const returnedValue = abilitiesGuard.canActivate(mockExecutionContext);
    expect(reflector.get).toBeCalledTimes(2);
    expect(abilityFactory.defineAbilityFor).toBeCalledTimes(1);
    expect(abilityFactory.defineAbilityFor).toBeCalledWith(user);
    expect(abilityFactory.defineAbilityFor(user).can).toBeCalledWith(
      UserAbility.Read.action,
      UserAbility.Read.subject,
    );
    expect(returnedValue).toBe(true);
  });
});
