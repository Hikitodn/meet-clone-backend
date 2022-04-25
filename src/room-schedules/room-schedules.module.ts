import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomSchedulesService } from './room-schedules.service';
import { RoomSchedule } from './entities/room-schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomSchedule])],
  providers: [RoomSchedulesService],
  exports: [RoomSchedulesService],
})
export class RoomSchedulesModule {}
