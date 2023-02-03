import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../database/prisma.service';
import { fakeUserEntity } from './user.service.mock';
import { DefaultUserService } from './users.service';

const prisma = {
  user: {
    create: jest.fn(({ data }) => data),

    findUnique: jest.fn(),
  },
};

describe('DefaultUserService', () => {
  let service: DefaultUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DefaultUserService,
        {
          useFactory: () => prisma,
          provide: PrismaService,
        },
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

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        fullName: 'John Doe',
        password: 'hashed123p4ssword!',
        startingPage: '/basic',
        username: 'jdoe',
      },
    });

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
      startingPage: '/basic',
      username: 'jdoe',
    });
  });

  it('should allow to find a user by their username', async () => {
    givenUserFound();

    const result = await service.findByUsername({ username: 'jdoe' });

    expect(result).toEqual(fakeUserEntity);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: 'jdoe' },
    });
  });

  it('should return null, when user is not found', async () => {
    givenUserNotFound();

    const result = await service.findByUsername({ username: 'non-existing' });

    expect(result).toEqual(null);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: 'non-existing' },
    });
  });

  function givenUserFound() {
    prisma.user.findUnique.mockResolvedValue(fakeUserEntity);
  }

  function givenUserNotFound() {
    prisma.user.findUnique.mockResolvedValue(null);
  }
});
