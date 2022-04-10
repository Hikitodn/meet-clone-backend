//Import package
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Req,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
//Import dto
import { CreateRoomDto } from './dto/create-room.dto';
//Import services
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post('/create-room')
  create(@Body() createRoomDto: CreateRoomDto, @Req() req: Request) {
    if (!createRoomDto.room_name)
      throw new BadRequestException('Room name is required');

    createRoomDto.user_id = req.user.id;
    return this.roomsService.createRoom(createRoomDto);
  }

  @Get('/get-token/:friendly_id')
  async getToken(
    @Param('friendly_id') friendly_id: string,
    @Req() req: Request,
  ) {
    const room = await this.roomsService.roomExists(friendly_id);

    if (!room) throw new BadRequestException('Room not found');

    const options = {
      user_id: req.user.user_id,
      user_name: req.user.name,
      friendly_id: friendly_id,
      allow_join: false,
    };

    const isMaster = await this.roomsService.isRoomMaster({
      user_id: options.user_id,
      friendly_id: options.friendly_id,
    });

    if (isMaster) {
      options.allow_join = true;
    } else {
      const isParticipant = await this.roomsService.isParticipantOfRoom({
        user_id: options.user_id,
        friendly_id: options.friendly_id,
      });

      if (isParticipant) {
        options.allow_join = true;
      }
    }

    return this.roomsService.createToken(options);
  }

  @Get('/list-rooms')
  async listRooms(@Req() req: Request) {
    const user_id = req.user.id;

    const rooms = await this.roomsService.listRooms(user_id);

    return rooms;
  }

  @Get('/is-master/:friendly_id')
  async isRoomMaster(
    @Param('friendly_id') friendly_id: string,
    @Req() req: Request,
  ) {
    const user_id = req.user.id;
    return this.roomsService.isRoomMaster({ user_id, friendly_id });
  }

  @Get('/is-participant/:friendly_id')
  async isParticipantOfRoom(
    @Param('friendly_id') friendly_id: string,
    @Req() req: Request,
  ) {
    const user_id = req.user.id;
    return this.roomsService.isParticipantOfRoom({ user_id, friendly_id });
  }

  @Delete('/delete-room/:friendly_id')
  async deleteRoom(
    @Param('friendly_id') friendly_id: string,
    @Req() req: Request,
  ) {
    const user_id = req.user.id;
    const room = await this.roomsService.roomExists(friendly_id);
    if (!room) throw new BadRequestException('Room not found');
    const isMaster = await this.roomsService.isRoomMaster({
      user_id: user_id,
      friendly_id: friendly_id,
    });
    if (!isMaster) throw new UnauthorizedException('You are not master');

    return this.roomsService.deleteRoom(friendly_id);
  }
}
