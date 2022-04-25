export interface ICreateTokenDto {
  user_id: string;
  user_name: string;
  friendly_id: string;
  room_join?: boolean;
  room_admin?: boolean;
  room_list?: boolean;
  room_create?: boolean;
}
