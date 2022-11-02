import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { AuthenticationGuard } from './auth.guard';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';

describe('AuthenticationGuard', () => {
  let authenticationGuard: AuthenticationGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const mockReflector = createMock<Reflector>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();
    authenticationGuard = module.get<AuthenticationGuard>(AuthenticationGuard);
    reflector = module.get<Reflector>(Reflector);
  });
  it('returns true if handler is public', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(true);
    const mockExecutionContext = createMock<ExecutionContext>();
    expect(authenticationGuard.canActivate(mockExecutionContext)).toBe(true);
  });
  it('calls authenticated if public is not true', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(false);
    const isAuthenticated = jest.fn().mockReturnValue(true);
    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          isAuthenticated,
        }),
      }),
    });
    const returnedResult =
      authenticationGuard.canActivate(mockExecutionContext);

    expect(isAuthenticated).toBeCalledTimes(1);
    expect(returnedResult).toBe(true);
  });
});
