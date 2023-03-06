import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { fakeCreateUserDto } from '../users/dto/create-user.dto';
import { fakeUserEntity } from '../users/user.service.mock';
import { DefaultUserService } from '../users/users.service';
import { fakeUserService } from '../users/users.service.fake';
import { AuthController } from './auth.controller';
import { DefaultAuthService, ValdiationResult } from './auth.service';
import { fakeAuthService } from './auth.service.fake';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: DefaultAuthService, useValue: fakeAuthService },
        { provide: DefaultUserService, useValue: fakeUserService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw not found exception, when user with provided username does not exist', async () => {
    givenUserNotFound();

    await expect(
      controller.login({ username: 'jdoe', password: 'p4ssword' }),
    ).rejects.toEqual(new NotFoundException());
  });

  it('should throw unauthorized exception, when user with provided username does not exist', async () => {
    givenInvalidPassword();

    await expect(
      controller.login({ username: 'jdoe', password: 'p4ssword' }),
    ).rejects.toEqual(new UnauthorizedException());
  });

  it('should throw unauthorized exception, when user has given an invalid password', async () => {
    givenInvalidPassword();

    await expect(
      controller.login({ username: 'jdoe', password: 'p4ssword' }),
    ).rejects.toEqual(new UnauthorizedException());
  });

  it('should return token, when username and password is valid', async () => {
    givenAuthenticationSuccessful();

    const result = await controller.login({
      username: 'jdoe',
      password: 'p4ssword',
    });

    expect(result).toEqual({ token: 'auth-token' });
  });

  it('should create user entity and login user', async () => {
    jest.mocked(fakeUserService.create).mockResolvedValue(fakeUserEntity);

    const result = await controller.register(fakeCreateUserDto);

    expect(fakeAuthService.login).toHaveBeenCalledWith({
      id: fakeUserEntity.id,
      username: fakeUserEntity.username,
    });
    expect(result).toEqual({ token: 'auth-token' });
  });

  function givenUserNotFound() {
    jest.mocked(fakeAuthService.validateUser).mockResolvedValue({
      user: null,
      validationResult: ValdiationResult.UserNotFound,
    });
  }

  function givenInvalidPassword() {
    jest.mocked(fakeAuthService.validateUser).mockResolvedValue({
      user: null,
      validationResult: ValdiationResult.InvalidPassword,
    });
  }

  function givenAuthenticationSuccessful() {
    jest.mocked(fakeAuthService.validateUser).mockResolvedValue({
      user: fakeUserEntity,
      validationResult: ValdiationResult.AuthenticationSuccessful,
    });

    jest
      .mocked(fakeAuthService.login)
      .mockResolvedValue({ token: 'auth-token' });
  }
});
