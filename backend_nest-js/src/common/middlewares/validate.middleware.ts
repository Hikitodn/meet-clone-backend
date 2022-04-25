import {
  Injectable,
  NestMiddleware,
  Req,
  Res,
  Next,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../auth/auth.service';
import * as _ from 'lodash';

@Injectable()
export class VaidateMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  async use(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const uid = _.get(req, 'session.uid');
    if (!uid) throw new UnauthorizedException('not logged in');
    const user = await this.authService.validateById(uid).catch(() => {
      throw new UnauthorizedException('invalid user');
    });
    _.set(req, 'user', user);
    next();
  }
}
