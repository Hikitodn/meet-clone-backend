import { IsNotEmpty } from 'class-validator';

export class ResJoinRoomDto {
  user_id: string;
  friendly_id: string;

  @IsNotEmpty()
  participant_id: string;

  is_allow: string;
}
