import { Module } from '@nestjs/common';
import { FirebaseModule } from './firebase/firebase.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RoomsModule } from './rooms/rooms.module';
import { ParticipantModule } from './participants/participants.module';
import { LivekitModule } from './livekit/livekit.module';
import { GuestsModule } from './guests/guests.module';
import { RoomSchedulesModule } from './room-schedules/room-schedules.module';

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
    GuestsModule,
    RoomSchedulesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
