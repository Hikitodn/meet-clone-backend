export class CreateRoomDto {
  user_id: string;
  user_name: string;
  room_name: string;
  emptyTimeout?: number;
  maxParticipants?: number;
}
