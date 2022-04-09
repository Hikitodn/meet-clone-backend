import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login/google')
  async loginWithGoogle(@Body() loginAuthDto: LoginAuthDto) {
    if (!loginAuthDto.id_token)
      throw new BadRequestException('Id token not provided');

    const user = await this.authService
      .loginWithGoogle(loginAuthDto)
      .catch(() => {
        throw new BadRequestException(
          'Firebase ID token has invalid signature',
        );
      });

    return user;
  }

  @Get('/verify/:id')
  async validateById(@Param('id') id: string) {
    const user = await this.authService.validateById(id).catch((err) => {
      throw new UnauthorizedException('Invalid user');
    });

    return user;
  }
}
