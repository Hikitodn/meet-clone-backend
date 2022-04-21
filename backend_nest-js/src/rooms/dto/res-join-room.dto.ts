import { IResJoinRoomDto } from '../interfaces/res-join-room-dto.interface';
import { IsNotEmpty, IsIn } from 'class-validator';

export class ResJoinRoomDto implements IResJoinRoomDto {
  friendly_id: string;

  @IsNotEmpty()
  participant_id: string;

  @IsIn(['true', 'false'])
  is_allow = 'false';

  constructor(dto: IResJoinRoomDto) {
    Object.assign(this, dto);
  }
}
