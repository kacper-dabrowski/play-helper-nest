import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DefaultAuthService, ValdiationResult } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: DefaultAuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const { user, validationResult } = await this.authService.validateUser(
      username,
      password,
    );

    if (validationResult === ValdiationResult.InvalidPassword) {
      throw new UnauthorizedException();
    }

    if (validationResult === ValdiationResult.UserNotFound) {
      throw new NotFoundException();
    }

    return user;
  }
}
