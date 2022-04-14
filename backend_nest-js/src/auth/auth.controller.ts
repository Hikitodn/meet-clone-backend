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

declare module 'express-session' {
  interface Session {
    uid: string;
  }
}

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

    req.session.uid = user.id;

    return user;
  }

  @Get('/verify')
  async validateById(@Req() req: Request) {
    const uid = req.session.uid;
    return await this.authService.validateById(uid).catch((err) => {
      throw new UnauthorizedException('Invalid user');
    });
  }

  @Get('/logout')
  async logout(@Req() req: Request) {
    req.session.uid = '';
    return 'Logout success';
  }
}
