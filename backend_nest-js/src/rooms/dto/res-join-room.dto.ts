import { IsNotEmpty } from 'class-validator';

export class ResJoinRoomDto {
  friendly_id: string;

  @IsNotEmpty()
  participant_id: string;

  is_allow: string;
}
