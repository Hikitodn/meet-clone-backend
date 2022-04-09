import { Injectable } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from '../users/users.service';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly usersService: UsersService,
  ) {}

  async loginWithGoogle(loginAuthDto: UpdateAuthDto) {
    const res = await this.firebaseService
      .getAuth()
      .verifyIdToken(loginAuthDto.id_token);

    return await this.usersService.findByEmailOrCreate({
      name: res.name,
      email: res.email,
      picture: res.picture,
    });
  }

  async validateById(id) {
    return await this.usersService.findById(id);
  }
}
