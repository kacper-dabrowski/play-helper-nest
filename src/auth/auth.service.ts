import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserModel } from '../users/user.entity';
import { DefaultUserService } from '../users/users.service';

export interface AuthService {
  login(user: UserAuthDto): Promise<{ token: string }>;
  validateUser(
    username: string,
    password: string,
  ): Promise<AuthenticationFailure | AuthenticationSuccessful>;
}

export interface UserAuthDto {
  username: string;
  id: string;
}

@Injectable()
export class DefaultAuthService implements AuthService {
  constructor(
    private usersService: DefaultUserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<AuthenticationFailure | AuthenticationSuccessful> {
    const user = await this.usersService.findByUsername({ username });

    if (!user) {
      return { user: null, validationResult: ValdiationResult.UserNotFound };
    }

    const arePasswordsEqual = await this.comparePasswords(
      password,
      user.password,
    );

    if (!arePasswordsEqual) {
      return { user: null, validationResult: ValdiationResult.InvalidPassword };
    }

    return {
      user,
      validationResult: ValdiationResult.AuthenticationSuccessful,
    };
  }

  async login({ username, id }: UserAuthDto): Promise<{ token: string }> {
    const payload = { username, id };

    const token = await this.jwtService.signAsync(payload);

    return {
      token: token.toString(),
    };
  }

  private comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

export enum ValdiationResult {
  UserNotFound = 'UserNotFound',
  InvalidPassword = 'InvalidPassword',
  AuthenticationSuccessful = 'AuthenticationSuccessful',
}

interface AuthenticationSuccessful {
  user: UserModel;
  validationResult: ValdiationResult.AuthenticationSuccessful;
}

interface AuthenticationFailure {
  user: null;
  validationResult:
    | ValdiationResult.InvalidPassword
    | ValdiationResult.UserNotFound;
}
