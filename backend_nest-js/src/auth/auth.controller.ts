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
import { LoginAuthDto } from './dto/login-auth.dto';
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
    @Body() loginAuthDto: LoginAuthDto,
    @Req() req: Request,
  ) {
    if (!loginAuthDto.id_token)
      throw new BadRequestException('Id token not provided');

    const user = await this.authService
      .loginWithGoogle(loginAuthDto)
      .catch(() => {
        throw new BadRequestException(
          'Firebase ID token has invalid signature',
        );
      });
    req.session.uid = user.id;
    return user;
  }

  @Get('/verify/:id')
  async validateById(@Param('id') id: string) {
    return await this.authService.validateById(id).catch(() => {
      throw new UnauthorizedException('Invalid user');
    });
  }

  @Get('/logout')
  async logout(@Req() req: Request) {
    req.session.destroy(() => {
      // nothing to do
    });
    return true;
  }
}
