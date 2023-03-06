import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserModel } from '../users/user.entity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): UserModel => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
