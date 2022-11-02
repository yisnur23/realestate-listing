import { Test, TestingModule } from '@nestjs/testing';
import { Profile } from 'passport-google-oauth20';
import { User } from '../profile/entities/user.entity';
import { ProfileService } from '../profile/profile.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let profileService: ProfileService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ProfileService,
          useValue: {
            findUserByEmail: jest.fn(),
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    profileService = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('findOrCreateUser service', () => {
    it('returns a user if it exists', async () => {
      const user = {
        id: 'user_id',
      } as User;
      const email = 'email';
      jest.spyOn(profileService, 'findUserByEmail').mockResolvedValue(user);

      const profile = {
        emails: [
          {
            value: email,
          },
        ],
      } as Profile;
      const returnedValue = await service.findOrCreateUser(profile);

      expect(profileService.findUserByEmail).toBeCalledTimes(1);
      expect(profileService.findUserByEmail).toBeCalledWith(email);
      expect(returnedValue).toEqual(user);
    });
    it('creates and returns a user if it doesnot exist', async () => {
      const email = 'email';
      const profile = {
        emails: [
          {
            value: email,
          },
        ],
        photos: [
          {
            value: 'value',
          },
        ],
      } as Profile;
      jest.spyOn(profileService, 'findUserByEmail');
      jest.spyOn(profileService, 'createUser');

      await service.findOrCreateUser(profile);
      expect(profileService.findUserByEmail).toBeCalledTimes(1);
      expect(profileService.createUser).toBeCalledTimes(1);
    });
  });
});
