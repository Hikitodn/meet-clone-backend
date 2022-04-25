import { IReqJoinRoomDto } from '../interfaces/req-join-room-dto.interface';

export class ReqJoinRoomDto implements IReqJoinRoomDto {
  user_id: string;
  participant_id: string;
  user_name: string;
  user_picture: string;
  friendly_id: string;

  constructor(dto: IReqJoinRoomDto) {
    Object.assign(this, dto);
  }
}
