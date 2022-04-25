import { PartialType } from '@nestjs/swagger';
import { CreateRoomScheduleDto } from './create-room-schedule.dto';

export class UpdateRoomScheduleDto extends PartialType(CreateRoomScheduleDto) {}
