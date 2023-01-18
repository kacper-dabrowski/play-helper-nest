import { UserService } from './service';

export const fakeUserService: UserService = {
  findByUsername: jest.fn(),
  create: jest.fn(),
};
