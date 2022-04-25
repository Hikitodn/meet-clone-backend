import { IsString, IsIn } from 'class-validator';
import { ICreateRoomDto } from '../interfaces/create-room-dto.interface';
import { DisplayModeEnum } from 'src/common/enums/room.enum';

export class CreateRoomDto implements ICreateRoomDto {
  @IsString()
  room_name: string;

  @IsIn(Object.values(DisplayModeEnum))
  display_mode = DisplayModeEnum.Private;

  user_id: string;
  friendly_id: string;
  empty_timeout = 5;
  max_participants = 100;

  constructor(dto: ICreateRoomDto) {
    Object.assign(this, dto);
  }
}
