export interface ICreateRoomDto {
  room_name: string;
  display_mode: string;
  user_id: string;
  friendly_id: string;
  empty_timeout: number;
  max_participants: number;
}
