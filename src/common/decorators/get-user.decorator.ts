import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserFromToken } from '../guards/jwt.guard';

interface RequestWithUser extends Request {
  user: UserFromToken;
}

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserFromToken => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
