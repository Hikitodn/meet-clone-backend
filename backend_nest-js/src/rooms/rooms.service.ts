//Import package
import {
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

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
    private readonly livekitService: LivekitService,
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
      created_at: createRoomDto.created_at,
      updated_at: createRoomDto.updated_at,
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

  async listParticipantsInRoom(friendly_id: string) {
    const listParticipants = await this.livekitService
      .getSVC()
      .listParticipants(friendly_id);

    const arrIdParticipants = await listParticipants.map(
      (participant) => participant.identity,
    );

    return await this.participantRepository.find({
      where: { room_id: friendly_id, user_id: In(arrIdParticipants) },
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

    const roomOfParticipant = await svc.getParticipant(
      resJoinRoomDto.friendly_id,
      resJoinRoomDto.participant_id,
    );

    const sidParticipant = roomOfParticipant.sid;

    if (resJoinRoomDto.is_allow) {
      const newParticipant = await this.participantRepository.create({
        user_id: resJoinRoomDto.participant_id,
        room_id: resJoinRoomDto.friendly_id,
      });
      await this.participantRepository.save(newParticipant);
    }

    const strData = JSON.stringify({
      type: 'room',
      action: 'res-join-room',
      payload: {
        message: 'Response join room',
        data: {
          is_allow: resJoinRoomDto.is_allow,
        },
      },
    });

    const encoder = new TextEncoder();
    const data = encoder.encode(strData);
    await svc.sendData(
      resJoinRoomDto.friendly_id,
      data,
      this.livekitService.getDataPacket().RELIABLE,
      [sidParticipant],
    );
    return true;
  }
}
