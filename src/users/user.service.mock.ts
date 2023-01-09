import { ObjectID } from 'mongodb';
import { UserService } from './service';
import { User } from './user.entity';

export const userServiceMock: UserService = {
  create: jest.fn(async () => fakeUserEntity),
  findByUsername: jest.fn(async () => fakeUserEntity),
};

export const fakeUserEntity: User = {
  id: new ObjectID(),
  username: 'jdoe',
  password: '123p4ssword!',
  fullName: 'John Doe',
  startingPage: 'basic',
};
