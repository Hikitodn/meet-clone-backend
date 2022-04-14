import { IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  room_name: string;

  user_id: string;
  friendly_id: string;
  user_name: string;
  created_at?: string;
  updated_at?: string;
  empty_timeout?: number = 0;
  max_participants?: number = 10;
}
