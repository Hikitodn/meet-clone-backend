//Import package
import {
  NotFoundException,
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
//Import dto
import { CreateRoomDto } from './dto/create-room.dto';
import { CreateTokenDto } from './dto/create-token.dto';
import { ReqJoinRoomDto } from './dto/req-join-room.dto';
import { ResJoinRoomDto } from './dto/res-join-room.dto';
//Import entities
import { Room } from './entities/room.entity';
import { Participant } from '../participants/entities/participant.entity';
import { User } from '../users/entities/user.entity';
//Import services
import { LivekitService } from '../livekit/livekit.service';
import { ParticipantsService } from '../participants/participants.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly livekitService: LivekitService,
    private readonly participantsService: ParticipantsService,
    private readonly usersService: UsersService,
  ) {}

  public makeFrendlyId() {
    const str =
      Math.random().toString(36).substring(2, 9) +
      Math.random().toString(36).substring(2, 9);
    const arr = str.substring(2, 13).split('');
    arr[3] = '-';
    arr[7] = '-';
    return arr.join('');
  }

  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    const newRoom = await this.roomRepository.create({
      user_id: createRoomDto.user_id,
      room_name: createRoomDto.room_name,
      friendly_id: createRoomDto.friendly_id,
      display_mode: createRoomDto.display_mode,
    });

    await this.livekitService.getSVC().createRoom({
      name: createRoomDto.friendly_id,
      emptyTimeout: createRoomDto.empty_timeout,
      maxParticipants: createRoomDto.max_participants,
    });

    return this.roomRepository.save(newRoom);
  }

  async getRoom(friendly_id: string) {
    const roomLivekit = await this.livekitService
      .getSVC()
      .listRooms([friendly_id]);

    if (!roomLivekit) throw new BadRequestException('Room not found');

    return await this.roomRepository.findOne({
      where: { friendly_id },
    });
  }

  async createToken(createTokenDto: CreateTokenDto): Promise<string> {
    const at = await this.livekitService.getAccessToken({
      identity: createTokenDto.user_id,
      name: createTokenDto.user_name,
    });

    at.addGrant({
      roomJoin: createTokenDto.room_join,
      room: createTokenDto.friendly_id,
    });

    return at.toJwt();
  }

  async listRooms(user_id: string): Promise<Room[]> {
    const svc = await this.livekitService.getSVC();

    const roomsIsOnline = (await svc.listRooms()) || [];
    const rooms = await roomsIsOnline.map((room) => room.name);

    const listRoomsResult = await this.roomRepository.find({
      where: {
        friendly_id: In([...rooms]),
        user_id: user_id,
      },
    });

    return listRoomsResult;
  }

  async deleteRoom(friendly_id: string) {
    const svc = await this.livekitService.getSVC();
    return svc.deleteRoom(friendly_id);
  }

  async listParticipantsInRoom(friendly_id) {
    const listParticipants = await this.livekitService
      .getSVC()
      .listParticipants(friendly_id);

    const arrIdParticipants = await listParticipants.map(
      (participant) => participant.identity,
    );

    return this.usersService.findManyOptions({
      where: { id: In(arrIdParticipants) },
    });
  }

  async reqJoinRoom(reqJoinRoomDto: ReqJoinRoomDto) {
    const svc = await this.livekitService.getSVC();

    const roomOfMaster = await svc
      .getParticipant(reqJoinRoomDto.friendly_id, reqJoinRoomDto.user_id)
      .catch((err) => {
        throw new Error(err);
      });

    const strData = JSON.stringify({
      type: 'room',
      action: 'req-join-room',
      payload: {
        message: 'Request join room',
        data: {
          participant_id: reqJoinRoomDto.participant_id,
          participant_name: reqJoinRoomDto.user_name,
          participant_picture: reqJoinRoomDto.user_picture,
        },
      },
    });

    const encoder = new TextEncoder();
    const data = encoder.encode(strData);
    await svc.sendData(
      reqJoinRoomDto.friendly_id,
      data,
      this.livekitService.getDataPacket().RELIABLE,
      [roomOfMaster.sid],
    );

    return 'OK';
  }

  async resJoinRoom(resJoinRoomDto: ResJoinRoomDto) {
    const svc = await this.livekitService.getSVC();

    const roomOfParticipant = await svc
      .getParticipant(
        resJoinRoomDto.participant_id,
        resJoinRoomDto.participant_id,
      )
      .catch((err) => {
        throw new NotFoundException('Could not find participant');
      });

    if (resJoinRoomDto.is_allow) {
      const participant = await this.participantsService.findOneOptions({
        where: {
          user_id: resJoinRoomDto.participant_id,
          room_id: resJoinRoomDto.friendly_id,
        },
      });

      if (!participant) {
        const newParticipant = await this.participantsService.create({
          user_id: resJoinRoomDto.participant_id,
          room_id: resJoinRoomDto.friendly_id,
        });
      }
    }

    const strData = await JSON.stringify({
      type: 'room',
      action: 'res-join-room',
      payload: {
        message: 'Response join room',
        data: {
          is_allow: resJoinRoomDto.is_allow,
        },
      },
    });

    const encoder = await new TextEncoder();
    const data = await encoder.encode(strData);
    await svc
      .sendData(
        resJoinRoomDto.participant_id,
        data,
        this.livekitService.getDataPacket().RELIABLE,
        [roomOfParticipant.sid],
      )
      .catch((err) => {
        throw new BadRequestException('Unable to contact paricipant');
      });
    return true;
  }
}
