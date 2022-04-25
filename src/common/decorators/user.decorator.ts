import { createParamDecorator, ExecutionContext } from '@nestjs/common';

declare module 'express' {
  interface Request {
    user: any;
  }
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
