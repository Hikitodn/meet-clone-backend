import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FirebaseModule } from '../firebase/firebase.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, FirebaseModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
