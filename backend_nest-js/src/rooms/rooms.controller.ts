//Import package
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Param,
  Req,
  BadRequestException,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
//Import dto
import { CreateRoomDto } from './dto/create-room.dto';
import { ResJoinRoomDto } from './dto/res-join-room.dto';
//Import services
import { RoomsService } from './rooms.service';
import { ParticipantService } from '../participants/participants.service';
//Import decorators
import { User } from 'src/common/decorators/user.decorator';

@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly participantService: ParticipantService,
  ) {}

  // Create a room
  @Post('/')
  async createRoom(@Body() createRoomDto: CreateRoomDto, @User() user) {
    createRoomDto.user_id = user.id;
    createRoomDto.friendly_id = this.roomsService.makeFrendlyId();
    return this.roomsService.createRoom(createRoomDto);
  }

  // get list of your room
  @Get('/')
  async listRooms(@User() user) {
    return await this.roomsService.listRooms(user.id);
  }

  // create token to join a room
  @Post('/:friendly_id/token')
  async getToken(@Param('friendly_id') friendly_id: string, @User() user) {
    const room = await this.roomsService.getRoom(friendly_id);

    if (!room) throw new BadRequestException('Room not found');

    const options = {
      user_id: user.id,
      user_name: user.name,
      friendly_id: room.friendly_id,
      room_join: true,
    };

    if (user.id == room.user_id) {
    } else {
      const participant = await this.participantService.findWhere({
        user_id: user.id,
        room_id: friendly_id,
      });

      if (!participant) {
        options.friendly_id = user.id;
      }
    }

    return this.roomsService.createToken(options);
  }

  // get a room
  @Get('/:friendly_id')
  async getRoom(@Param('friendly_id') friendly_id: string, @User() user) {
    const room = await this.roomsService.getRoom(friendly_id);

    if (room.user_id == user.id) {
      return { ...room, is_master: true };
    }

    const participant = await this.participantService.findOne(user.id);

    return {
      room_name: room.room_name,
      friendly_id: room.friendly_id,
      is_participant: participant ? true : false,
    };
  }

  // delete a room
  @Delete('/:friendly_id')
  async deleteRoom(
    @Param('friendly_id') friendly_id: string,
    @Req() req: Request,
  ) {
    return;
  }

  // get list participants in room
  @Get('/:friendly_id/participants')
  async listParticipants(
    @Param('friendly_id') friendly_id: string,
    @User() user,
  ) {
    const room = await this.roomsService.getRoom(friendly_id);

    if (!room) throw new BadRequestException('Room not found');

    if (room.user_id != user.id)
      throw new UnauthorizedException('Unauthorized');

    return this.roomsService.listParticipantsInRoom(friendly_id);
  }

  // req to join room
  @Get('/:friendly_id/req-join-room')
  async reqJoinRoom(@Param('friendly_id') friendly_id: string, @User() user) {
    const room = await this.roomsService.getRoom(friendly_id);
    if (!room) throw new BadRequestException('Room not found');

    const result = await this.roomsService
      .reqJoinRoom({
        user_id: room.user_id,
        user_name: user.name,
        participant_id: user.id,
        friendly_id: room.friendly_id,
        user_picture: user.picture,
      })
      .then((res) => {
        return 'Request success, please wait response';
      })
      .catch((error) => {
        return {
          statusCode: HttpStatus.CONTINUE,
          message: 'Room master is not available',
        };
      });

    return result;
  }

  // res to join a room
  @Get('/:friendly_id/res-join-room')
  async resJoinRoom(
    @Param('friendly_id') friendly_id: string,
    @User() user,
    @Query() resJoinRoomDto: ResJoinRoomDto,
  ) {
    const room = await this.roomsService.getRoom(friendly_id);

    if (room.user_id != user.id)
      throw new UnauthorizedException('Unauthorized');

    resJoinRoomDto.is_allow =
      resJoinRoomDto.is_allow == 'true' ? 'true' : 'false';

    await this.roomsService.resJoinRoom({
      friendly_id: friendly_id,
      participant_id: resJoinRoomDto.participant_id,
      is_allow: resJoinRoomDto.is_allow,
    });

    return 'Response success';
  }
}
