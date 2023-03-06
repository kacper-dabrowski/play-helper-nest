import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { fakeUserEntity } from '../users/user.service.mock';
import { DefaultUserService } from '../users/users.service';
import { fakeUserService } from '../users/users.service.fake';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userService: DefaultUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: { getOrThrow: jest.fn().mockReturnValue('secret') },
        },
        {
          provide: DefaultUserService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userService = module.get<DefaultUserService>(DefaultUserService);
  });

  describe('validate', () => {
    it('should return user id and username if user exists', async () => {
      const payload = { username: 'testuser' };
      jest
        .mocked(fakeUserService.findByUsername)
        .mockResolvedValue(fakeUserEntity);

      const result = await jwtStrategy.validate(payload);

      expect(userService.findByUsername).toHaveBeenCalledWith({
        username: payload.username,
      });
      expect(result).toEqual({
        id: fakeUserEntity.id,
        username: fakeUserEntity.username,
      });
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      const payload = { username: 'testuser' };
      jest.mocked(fakeUserService.findByUsername).mockResolvedValue(undefined);

      await expect(jwtStrategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
