import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { fakeUserEntity } from './user.service.mock';
import { DefaultUserService } from './users.service';

const userRepository = {
  create: jest.fn(async (user) => user),
  findOneBy: jest.fn(),
  save: jest.fn(async (user) => user),
};

describe('DefaultUserService', () => {
  let service: DefaultUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DefaultUserService,
        { useFactory: () => userRepository, provide: getRepositoryToken(User) },
      ],
    }).compile();

    service = module.get<DefaultUserService>(DefaultUserService);

    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation((password: string) => `hashed${password}`);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user, encrypt the password and save it in the database', async () => {
    const { username, password, startingPage, fullName } = fakeUserEntity;

    await service.create({ username, password, startingPage, fullName });

    expect(userRepository.create).toHaveBeenCalledWith({
      fullName: 'John Doe',
      password: 'hashed123p4ssword!',
      startingPage: 'basic',
      username: 'jdoe',
    });
    expect(userRepository.save).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith(fakeUserEntity.password, 8);
  });

  it('should return a modified user', async () => {
    const { username, password, startingPage, fullName } = fakeUserEntity;

    const result = await service.create({
      username,
      password,
      startingPage,
      fullName,
    });

    expect(result).toEqual({
      fullName: 'John Doe',
      password: 'hashed123p4ssword!',
      startingPage: 'basic',
      username: 'jdoe',
    });
  });

  it('should allow to find a user by their username', async () => {
    givenUserFound();

    const result = await service.findByUsername('jdoe');

    expect(result).toEqual(fakeUserEntity);
    expect(userRepository.findOneBy).toHaveBeenCalledWith({ username: 'jdoe' });
  });

  it('should return null, when user is not found', async () => {
    givenUserNotFound();

    const result = await service.findByUsername('non-existing');

    expect(result).toEqual(null);
    expect(userRepository.findOneBy).toHaveBeenCalledWith({
      username: 'non-existing',
    });
  });

  function givenUserFound() {
    userRepository.findOneBy.mockResolvedValue(fakeUserEntity);
  }

  function givenUserNotFound() {
    userRepository.findOneBy.mockResolvedValue(null);
  }
});
