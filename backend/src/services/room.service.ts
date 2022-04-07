import dotenv from "dotenv";
import async from "async";
import {
  AccessToken,
  RoomServiceClient,
  DataPacket_Kind,
} from "livekit-server-sdk";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Room, Participant, User } from "../entities";
import AppDataSource from "../configs/db.config";

import { APIError } from "../lib/api/apiControllerBase";

const roomRepo = AppDataSource.getRepository(Room);
const participantRepo = AppDataSource.getRepository(Participant);
const userRepo = AppDataSource.getRepository(User);

dotenv.config();

// Create a new room
export const createRoom = async (
  user_id: string,
  room_id: string,
  room_name: string,
  emptyTimeout: number = 60,
  maxParticipants: number = 20
) => {
  const svc = await new RoomServiceClient(
    process.env.LIVEKIT_API_HOST,
    process.env.LIVEKIT_CLIENT_ID,
    process.env.LIVEKIT_CLIENT_SECRET
  );

  const newRoom = await roomRepo.create({
    user_id: user_id,
    friendly_id: room_id,
    room_name: room_name,
  });

  if (!newRoom)
    throw new APIError(
      ReasonPhrases.NOT_FOUND,
      StatusCodes.NOT_FOUND,
      "Room not created"
    );

  const roomLivekit = await svc.createRoom({
    name: room_id,
    emptyTimeout,
    maxParticipants,
  });

  if (!roomLivekit) throw new APIError(ReasonPhrases.INTERNAL_SERVER_ERROR);

  roomRepo.save(newRoom);

  return newRoom;
};

// Check room master
export const isRoomMaster = async (user_id: string, room_id: string) => {
  const roomOfMsater = await roomRepo.findOneBy({
    user_id: user_id,
    friendly_id: room_id,
  });

  if (!roomOfMsater) return false;

  return true;
};

// Check participant of room
export const isParticipantOfRoom = async (user_id: string, room_id: string) => {
  const participant = await participantRepo.findOneBy({
    user_id: user_id,
    room_id: room_id,
  });

  if (!participant) return false;

  return true;
};

// Create token
export const createToken = async (
  user_id: string,
  user_name: string,
  room_id: string,
  is_allow: boolean = false
) => {
  const at = await new AccessToken(
    process.env.LIVEKIT_CLIENT_ID,
    process.env.LIVEKIT_CLIENT_SECRET,
    {
      identity: user_id,
      name: user_name,
    }
  );

  const isMaster = await isRoomMaster(user_id, room_id);
  if (isMaster) {
    await at.addGrant({ roomJoin: true, room: room_id });
    return at.toJwt();
  }

  const isParticipant = await isParticipantOfRoom(user_id, room_id);
  if (isParticipant) {
    await at.addGrant({ roomJoin: true, room: room_id });
    return at.toJwt();
  }

  at.addGrant({ roomJoin: is_allow, room: room_id });
  return at.toJwt();
};

// Join room
export const reqJoinRoom = async (
  user_id: string,
  user_name: string,
  room_id: string
): Promise<boolean> => {
  const svc = await new RoomServiceClient(
    process.env.LIVEKIT_API_HOST,
    process.env.LIVEKIT_CLIENT_ID,
    process.env.LIVEKIT_CLIENT_SECRET
  );

  const roomDB = await roomRepo.findOneBy({
    friendly_id: room_id,
  });

  if (!roomDB)
    throw new APIError(
      ReasonPhrases.NOT_FOUND,
      StatusCodes.NOT_FOUND,
      "room not found"
    );

  const roomMasterId = roomDB.user_id;
  const roomOfMaster = await svc.getParticipant(room_id, roomMasterId);
  const sidMaster = roomOfMaster.sid;
  // Create data for socket
  const strData = JSON.stringify({
    type: "room",
    data: {
      message: "req_join_room",
      data: {
        participant_name: user_name,
        participant_id: user_id,
      },
    },
  });
  const encoder = new TextEncoder();
  const data = encoder.encode(strData);
  await svc.sendData(room_id, data, DataPacket_Kind.RELIABLE, [sidMaster]);

  return true;
};

// Response join room
export const resJoinRoom = async (
  user_id: string,
  participant_id: string,
  room_id: string,
  is_allow: boolean
) => {
  const svc = await new RoomServiceClient(
    process.env.LIVEKIT_API_HOST,
    process.env.LIVEKIT_CLIENT_ID,
    process.env.LIVEKIT_CLIENT_SECRET
  );

  const master = await isRoomMaster(user_id, room_id);

  if (!master)
    throw new APIError(
      ReasonPhrases.BAD_REQUEST,
      StatusCodes.BAD_REQUEST,
      "you are not master"
    );

  const participantDetail = await userRepo.findOneBy({
    id: participant_id,
  });

  const roomOfParticipant = await svc.getParticipant(room_id, participant_id);
  const sidParticipant = roomOfParticipant.sid;

  if (is_allow) {
    const participant = await participantRepo.create({
      user_id: participant_id,
      room_id: room_id,
    });
    await participantRepo.save(participant);
  }

  const dataRes = is_allow
    ? {
        token: await createToken(
          participant_id,
          participantDetail.name,
          room_id
        ),
        isAllow: true,
      }
    : { isAllow: false };

  const strData = JSON.stringify({
    type: "room",
    data: {
      message: "res_join_room",
      data: dataRes,
    },
  });
  const encoder = new TextEncoder();
  const data = encoder.encode(strData);
  await svc.sendData(room_id, data, DataPacket_Kind.RELIABLE, [sidParticipant]);
  return true;
};

// export const updateParticipant = async () => {
//   try {
//     const svc = await new RoomServiceClient(
//       process.env.LIVEKIT_API_HOST,
//       process.env.LIVEKIT_CLIENT_ID,
//       process.env.LIVEKIT_CLIENT_SECRET
//     );

//     const room_id = "";
//     const participantId = "";
//   } catch (error) {
//     throw new Error(error);
//   }
// };

// List room
export const listRooms = async (user_id: string) => {
  const svc = await new RoomServiceClient(
    process.env.LIVEKIT_API_HOST,
    process.env.LIVEKIT_CLIENT_ID,
    process.env.LIVEKIT_CLIENT_SECRET
  );

  const listRooms = await svc.listRooms();

  const rooms = [];

  await async
    .filter(listRooms, async (room, callback) => {
      const yourRoom = await roomRepo.findOneBy({
        friendly_id: room.name,
        user_id: user_id,
      });
      if (yourRoom) {
        await rooms.push(yourRoom);
        return callback(null, true);
      }
      return callback(null, false);
    })
    .then(async (result) => {
      return result;
    });
  return rooms;
};

// delete a room
export const deleteRoom = async (user_id: string, room_id: string) => {
  const svc = await new RoomServiceClient(
    process.env.LIVEKIT_API_HOST,
    process.env.LIVEKIT_CLIENT_ID,
    process.env.LIVEKIT_CLIENT_SECRET
  );

  const listRooms = await svc.listRooms();

  const room = listRooms.find((room) => {
    console.log(room.name === room_id ? true : false);
    return room.name === room_id ? true : false;
  });

  if (!room) throw new APIError(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND);

  const isMaster = await isRoomMaster(user_id, room_id);

  if (!isMaster)
    throw new APIError(
      ReasonPhrases.BAD_REQUEST,
      StatusCodes.BAD_REQUEST,
      "you are not master"
    );

  return await svc.deleteRoom(room_id);
};
