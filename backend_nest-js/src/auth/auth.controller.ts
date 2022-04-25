import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { LoginWithGoogleDto } from './dto/login-with-google.dto';
import * as _ from 'lodash';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/login/google')
  async loginWithGoogle(
    @Query() loginWithGoogleDto: LoginWithGoogleDto,
    @Req() req: Request,
  ) {
    const { id_token } = loginWithGoogleDto;

    const user = await this.authService
      .loginWithGoogle(id_token)
      .catch((err) => {
        throw new BadRequestException(
          'Firebase ID token has invalid signature',
        );
      });

    _.set(req, 'session.uid', user.id);

    return user;
  }

  @Get('/verify')
  async validateById(@Req() req: Request) {
    const uid = _.get(req, 'session.uid');
    if (!uid) throw new UnauthorizedException('Invalid user');
    return await this.authService.validateById(uid).catch((err) => {
      throw new UnauthorizedException('Invalid user');
    });
  }

  @Get('/logout')
  async logout(@Req() req: Request) {
    _.set(req, 'session.uid', null);
    return 'Logout success';
  }
}
