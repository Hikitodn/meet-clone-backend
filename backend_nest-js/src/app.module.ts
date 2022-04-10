import { Module } from '@nestjs/common';
import { FirebaseModule } from './firebase/firebase.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RoomsModule } from './rooms/rooms.module';
import { ParticipantModule } from './participant/participant.module';
import { LivekitModule } from './livekit/livekit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    FirebaseModule,
    UsersModule,
    DatabaseModule,
    AuthModule,
    RoomsModule,
    ParticipantModule,
    LivekitModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
