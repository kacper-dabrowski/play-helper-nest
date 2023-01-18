import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { compare } from 'bcrypt';
import { fakeUserEntity, userServiceMock } from '../users/user.service.mock';
import { DefaultUserService } from '../users/users.service';
import { DefaultAuthService, ValdiationResult } from './auth.service';
import { fakeLoginUserDto } from './dto/login-user.dto';

jest.mock('bcrypt');

const fakeJwtService = {
  signAsync: jest.fn(() => 'some-token'),
};

describe('DefaultAuthService', () => {
  let service: DefaultAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DefaultAuthService,
        { provide: JwtService, useFactory: () => fakeJwtService },
        { provide: DefaultUserService, useFactory: () => userServiceMock },
      ],
    }).compile();

    service = module.get<DefaultAuthService>(DefaultAuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should not return user and return UserNotFound, when user not found', async () => {
    givenUserNotFound();

    const result = await service.validateUser(
      fakeLoginUserDto.username,
      fakeLoginUserDto.password,
    );

    expect(result).toEqual({
      user: null,
      validationResult: ValdiationResult.UserNotFound,
    });
    expect(userServiceMock.findByUsername).toHaveBeenCalledWith(
      fakeLoginUserDto.username,
    );
    expect(compare).not.toHaveBeenCalled();
  });

  it('should not return user and return InvalidPassword, when password is invalid', async () => {
    givenUserFound();
    givenPasswordInvalid();

    const result = await service.validateUser(
      fakeLoginUserDto.username,
      'hashedPwd',
    );

    expect(result).toEqual({
      user: null,
      validationResult: ValdiationResult.InvalidPassword,
    });
    expect(userServiceMock.findByUsername).toHaveBeenCalledWith(
      fakeLoginUserDto.username,
    );
    expect(compare).toHaveBeenCalledWith('hashedPwd', fakeUserEntity.password);
  });

  it('should return user and return validation successful, when password is valid and user found', async () => {
    givenUserFound();
    givenPasswordValid();

    const result = await service.validateUser(
      fakeLoginUserDto.username,
      'hashedPwd',
    );

    expect(result).toEqual({
      user: fakeUserEntity,
      validationResult: ValdiationResult.AuthenticationSuccessful,
    });
    expect(compare).toHaveBeenCalledWith('hashedPwd', fakeUserEntity.password);
    expect(userServiceMock.findByUsername).toHaveBeenCalledWith(
      fakeLoginUserDto.username,
    );
  });

  it('should sign username and id into the token', async () => {
    const result = await service.login(fakeUserEntity);

    expect(result).toEqual({
      token: 'some-token',
    });
    expect(fakeJwtService.signAsync).toHaveBeenCalledWith({
      id: expect.anything(),
      username: 'jdoe',
    });
  });

  function givenUserNotFound() {
    jest.mocked(userServiceMock.findByUsername).mockResolvedValue(null);
  }

  function givenUserFound() {
    jest
      .mocked(userServiceMock.findByUsername)
      .mockResolvedValue(fakeUserEntity);
  }

  function givenPasswordValid() {
    (compare as jest.Mock).mockResolvedValue(true);
  }

  function givenPasswordInvalid() {
    (compare as jest.Mock).mockResolvedValue(false);
  }
});
