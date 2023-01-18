import { AuthService } from './auth.service';

export const fakeAuthService: AuthService = {
  login: jest.fn(),
  validateUser: jest.fn(),
};
