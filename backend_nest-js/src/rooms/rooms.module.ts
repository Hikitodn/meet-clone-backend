import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { VaidateMiddleware } from '../common/middlewares/validate.middleware';
import { AuthModule } from '../auth/auth.module';
import { ParticipantModule } from '../participants/participants.module';
import { Room } from './entities/room.entity';
import { User } from '../users/entities/user.entity';
import { Participant } from '../participants/entities/participant.entity';
import { LivekitModule } from 'src/livekit/livekit.module';

@Module({
  imports: [
    LivekitModule,
    AuthModule,
    ParticipantModule,
    TypeOrmModule.forFeature([Room, Participant, User]),
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VaidateMiddleware).forRoutes('rooms');
  }
}
