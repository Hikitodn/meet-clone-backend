import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly usersService: UsersService,
  ) {}

  async loginWithGoogle(id_token: string): Promise<User> {
    const res = await this.firebaseService.getAuth().verifyIdToken(id_token);
    return await this.usersService.findByEmailOrCreate({
      name: res.name,
      email: res.email,
      picture: res.picture,
    });
  }

  async validateById(uid: string): Promise<User> {
    const user = await this.usersService.findById(uid);
    if (!user) throw new UnauthorizedException('user not found');
    return user;
  }
}
