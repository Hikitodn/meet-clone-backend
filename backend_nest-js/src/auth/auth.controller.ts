import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

declare module 'express-session' {
  interface Session {
    uid: string;
  }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login/google')
  async loginWithGoogle(
    @Body('id_token') id_token: string,
    @Req() req: Request,
  ) {
    if (!id_token) throw new BadRequestException('Id token not provided');
    const user = await this.authService
      .loginWithGoogle(id_token)
      .catch((err) => {
        throw new BadRequestException(
          'Firebase ID token has invalid signature',
        );
      });
    req.session.uid = user.id;
    return user;
  }

  @Get('/verify')
  async validateById(@Req() req: Request) {
    const uid = req.session.uid;
    if (!uid) throw new UnauthorizedException('Invalid user');
    return await this.authService.validateById(uid).catch(() => {
      throw new UnauthorizedException('Invalid user');
    });
  }

  @Get('/logout')
  async logout(@Req() req: Request) {
    req.session.destroy(() => {
      // nothing to do
    });
    return 'Logout success';
  }
}
