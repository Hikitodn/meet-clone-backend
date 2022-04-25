import { Injectable } from '@nestjs/common';
import { CreateRoomScheduleDto } from './dto/create-room-schedule.dto';
import { UpdateRoomScheduleDto } from './dto/update-room-schedule.dto';

@Injectable()
export class RoomSchedulesService {
  create(createRoomScheduleDto: CreateRoomScheduleDto) {
    return 'This action adds a new roomSchedule';
  }

  findAll() {
    return `This action returns all roomSchedules`;
  }

  findOne(id: number) {
    return `This action returns a #${id} roomSchedule`;
  }

  update(id: number, updateRoomScheduleDto: UpdateRoomScheduleDto) {
    return `This action updates a #${id} roomSchedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} roomSchedule`;
  }
}
