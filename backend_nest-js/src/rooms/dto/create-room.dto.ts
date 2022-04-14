export class CreateRoomDto {
  user_id: string;
  friendly_id: string;
  user_name: string;
  room_name: string;
  created_at?: string;
  updated_at?: string;
  emptyTimeout?: number = 5;
  maxParticipants?: number = 10;
}
