import { UserService } from './service';
import { User } from './user.entity';

export const userServiceMock: UserService = {
  create: jest.fn(async () => fakeUserEntity),
  findByUsername: jest.fn(async () => fakeUserEntity),
};

export const fakeUserEntity: User = {
  id: '5f6d0d6f4f6a7b6b6b6b6b6',
  username: 'jdoe',
  password: '123p4ssword!',
  fullName: 'John Doe',
  startingPage: '/basic',
};
