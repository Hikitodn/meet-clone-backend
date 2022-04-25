import { ICreateTokenDto } from '../interfaces/create-token-dto.interface';

export class CreateTokenDto implements ICreateTokenDto {
  user_id: string;
  user_name: string;
  friendly_id: string;
  room_join = true;
  room_admin = false;
  room_list = false;
  room_create = false;

  constructor(dto: ICreateTokenDto) {
    Object.assign(this, dto);
  }
}
