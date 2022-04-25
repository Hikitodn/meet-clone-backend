import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as _ from 'lodash';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return _.get(req, 'user');
  },
);
