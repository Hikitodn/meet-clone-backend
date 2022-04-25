import { Injectable } from '@nestjs/common';
import { GetAccessTokenDto } from './dto/get-access-token-livekit.dto';
import {
  AccessToken,
  RoomServiceClient,
  DataPacket_Kind,
} from 'livekit-server-sdk';

@Injectable()
export class LivekitService {
  svc: RoomServiceClient;
  constructor() {
    this.svc = new RoomServiceClient(
      process.env.LIVEKIT_API_HOST,
      process.env.LIVEKIT_CLIENT_ID,
      process.env.LIVEKIT_CLIENT_SECRET,
    );
  }

  getSVC() {
    return this.svc;
  }

  getAccessToken(options: GetAccessTokenDto) {
    return new AccessToken(
      process.env.LIVEKIT_CLIENT_ID,
      process.env.LIVEKIT_CLIENT_SECRET,
      options,
    );
  }

  // async createRoom() {
  //   return this.svc.createRoom();
  // }

  getDataPacket() {
    return DataPacket_Kind;
  }
}
