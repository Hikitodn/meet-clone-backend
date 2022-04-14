//Import package
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import async from 'async';
//Import dto
import { CreateRoomDto } from './dto/create-room.dto';
import { GetRoomMasterDto } from './dto/get-room-master.dto';
import { IsRoomMasterDto } from './dto/is-room-master.dto';
import { IsRoomParticipantDto } from './dto/is-room-participant.dto';
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
    const arr = Math.random().toString(36).substring(2, 13).split('');
    arr[3] = '-';
    arr[7] = '-';
    return arr.join('');
  }

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const newRoom = await this.roomRepository.create({
      user_id: createRoomDto.user_id,
      room_name: createRoomDto.room_name,
      friendly_id: createRoomDto.friendly_id,
      created_at: createRoomDto.created_at,
      updated_at: createRoomDto.updated_at,
    });

    await this.livekitService.getSVC().createRoom({
      name: createRoomDto.friendly_id,
      emptyTimeout: createRoomDto.emptyTimeout,
      maxParticipants: createRoomDto.maxParticipants,
    });

    return this.roomRepository.save(newRoom);
  }

  async isRoomMaster(
    isRoomMasterDto: IsRoomMasterDto,
  ): Promise<Room | undefined> {
    const room = await this.roomRepository.findOne({
      where: {
        user_id: isRoomMasterDto.user_id,
        friendly_id: isRoomMasterDto.friendly_id,
      },
    });
    if (!room) return undefined;
    return room;
  }

  async isParticipantOfRoom(
    isRoomParticipantDto: IsRoomParticipantDto,
  ): Promise<Room | undefined> {
    const participant = await this.participantRepository.findOne({
      where: {
        user_id: isRoomParticipantDto.user_id,
        room_id: isRoomParticipantDto.friendly_id,
      },
    });

    const room = await this.roomRepository.findOne(participant.room_id);
    if (!room) return undefined;
    return room;
  }

  async roomExists(friendly_id: string): Promise<Room | undefined> {
    const room = await this.roomRepository.findOne({
      where: {
        friendly_id: friendly_id,
      },
    });
    if (!room) return undefined;
    return room;
  }

  async createToken(createTokenDto: CreateTokenDto): Promise<string> {
    const at = await this.livekitService.getAccessToken({
      identity: createTokenDto.user_id,
      name: createTokenDto.user_name,
    });

    at.addGrant({
      roomJoin: createTokenDto.allow_join || false,
      room: createTokenDto.friendly_id,
    });

    return at.toJwt();
  }

  async listRooms(user_id: string): Promise<Room[]> {
    const svc = await this.livekitService.getSVC();
    const roomRepo = this.roomRepository;
    const rooms = (await svc.listRooms()) || [];

    const listRoomsResult = [];

    await async.filter(rooms, async (room) => {
      const roomCurrent = await roomRepo.findOne({
        friendly_id: room.name,
        user_id: user_id,
      });
      if (roomCurrent) {
        await listRoomsResult.push(roomCurrent);
      }
    });

    return listRoomsResult;
  }

  async deleteRoom(friendly_id: string) {
    const svc = await this.livekitService.getSVC();
    return svc.deleteRoom(friendly_id);
  }

  async reqJoinRoom(reqJoinRoomDto: ReqJoinRoomDto) {
    const svc = await this.livekitService.getSVC();

    const room = await this.roomRepository.findOne({
      friendly_id: reqJoinRoomDto.friendly_id,
    });

    if (!room) throw new BadRequestException(`room doesn't exist`);

    const roomOfMaster = await svc.getParticipant(
      reqJoinRoomDto.friendly_id,
      room.user_id,
    );
    const sidMaster = roomOfMaster.sid;

    // nêu chủ phòng chưa vào thì xử lí tiếp

    const strData = JSON.stringify({
      type: 'room',
      data: {
        message: 'req_join_room',
        data: {
          participant_name: reqJoinRoomDto.user_name,
          participant_id: reqJoinRoomDto.user_id,
        },
      },
    });

    const encoder = new TextEncoder();
    const data = encoder.encode(strData);
    await svc.sendData(
      reqJoinRoomDto.friendly_id,
      data,
      this.livekitService.getDataPacket().RELIABLE,
      [sidMaster],
    );

    return;
  }

  async resJoinRoom(resJoinRoomDto: ResJoinRoomDto) {
    const svc = await this.livekitService.getSVC();

    const master = await this.isRoomMaster({
      user_id: resJoinRoomDto.user_id,
      friendly_id: resJoinRoomDto.friendly_id,
    });

    if (!master) return null;

    const participantDetail = await this.userRepository.findOne({
      id: resJoinRoomDto.participant_id,
    });

    const roomOfParticipant = await svc.getParticipant(
      resJoinRoomDto.friendly_id,
      resJoinRoomDto.participant_id,
    );
    const sidParticipant = roomOfParticipant.sid;

    if (resJoinRoomDto.allow_join) {
      const newParticipant = await this.participantRepository.create({
        user_id: resJoinRoomDto.user_id,
        room_id: resJoinRoomDto.friendly_id,
      });
      await this.participantRepository.save(newParticipant);
    }

    const dataRes = resJoinRoomDto.allow_join
      ? {
          token: await this.createToken({
            user_id: resJoinRoomDto.user_id,
            user_name: participantDetail.name,
            friendly_id: resJoinRoomDto.friendly_id,
            allow_join: true,
          }),
          isAllow: true,
        }
      : { isAllow: false };

    const strData = JSON.stringify({
      type: 'room',
      data: {
        message: 'res_join_room',
        data: dataRes,
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

  async getParticipant({
    friendly_id,
    user_id,
  }: {
    friendly_id: string;
    user_id: string;
  }) {
    const roomLivekit = await this.livekitService
      .getSVC()
      .getParticipant(friendly_id, user_id);
  }

  // async getRoomMaster({
  //   friendly_id,
  //   user_id,
  // }: {
  //   friendly_id: string;
  //   user_id: string;
  // }) {
  //   return;
  // }
}
