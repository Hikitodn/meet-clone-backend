import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { roomService } from "../services";
import { Success, APIError } from "../lib/api/apiControllerBase";

dotenv.config();

// create new room
export const createRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;
    const room_id = Math.random().toString(36).slice(2, 8);
    const room_name = req.body.room_name;

    if (!room_name || !user)
      throw new APIError(ReasonPhrases.BAD_REQUEST, StatusCodes.BAD_REQUEST);

    const newRoom = await roomService.createRoom(user.id, room_id, room_name);
    res.status(StatusCodes.OK).json(new Success(newRoom));
  } catch (error) {
    next(error);
  }
};

// get Token
export const getToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { room_id } = req.params;
    const user_id = req.user.id;
    const user_name = req.user.name;

    if (!room_id)
      throw new APIError(ReasonPhrases.BAD_REQUEST, StatusCodes.BAD_REQUEST);

    const token = await roomService.createToken(user_id, user_name, room_id);

    res.status(StatusCodes.OK).json(new Success(token));
  } catch (error) {
    next(error);
  }
};

// request join room
export const reqJoinRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { room_id } = req.params;
    const { user_id, user_name } = req.user;

    if (!room_id)
      throw new APIError(ReasonPhrases.BAD_REQUEST, StatusCodes.BAD_REQUEST);

    const result = await roomService.reqJoinRoom(user_id, user_name, room_id);

    res.status(StatusCodes.OK).json(new Success(result));
  } catch (error) {
    next(error);
  }
};

// response join room
export const resJoinRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const roomMasterId = req.user.uid;
    const roomId = req.body.roomName;
    const participantId = req.body.participantId;
    const isAllow = req.body.isAllow;

    if (!roomMasterId || !roomId || !participantId || !isAllow)
      throw new APIError(ReasonPhrases.BAD_REQUEST, StatusCodes.BAD_REQUEST);

    const result = await roomService.resJoinRoom(
      roomId,
      roomMasterId,
      participantId,
      isAllow
    );

    res.status(StatusCodes.OK).json(new Success(result));
  } catch (error) {
    next(error);
  }
};

// update participant
export const updateParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};

// list room
export const listRooms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = req.user.id;
    const listRooms = await roomService.listRooms(user_id);
    res.status(StatusCodes.OK).json(new Success(listRooms));
  } catch (error) {
    next(error);
  }
};

// check participant
export const isParticipantOfRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const room_id = req.params.room_id;
    const user_id = req.user.id;

    if (!room_id || !user_id)
      throw new APIError(ReasonPhrases.BAD_REQUEST, StatusCodes.BAD_REQUEST);

    const result = await roomService.isParticipantOfRoom(user_id, room_id);
    res.status(StatusCodes.OK).json(new Success(result));
  } catch (error) {
    next(error);
  }
};

// check room master
export const isRoomMaster = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const room_id = req.params.room_id;
    const user_id = req.user.id;

    if (!room_id || !user_id)
      throw new APIError(ReasonPhrases.BAD_REQUEST, StatusCodes.BAD_REQUEST);

    const result = await roomService.isRoomMaster(user_id, room_id);
    res.status(StatusCodes.OK).json(new Success(result));
  } catch (error) {
    next(error);
  }
};

// delete room
export const deleteRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const room_id = req.params.room_id;
    const user_id = req.user.id;

    if (!room_id || !user_id)
      throw new APIError(ReasonPhrases.BAD_REQUEST, StatusCodes.BAD_REQUEST);

    const result = await roomService.deleteRoom(user_id, room_id);
    res.status(StatusCodes.OK).json(new Success(result));
  } catch (error) {
    next(error);
  }
};

// list participants in the room
export const listParticipants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const room_id = req.params.room_id;
    const user_id = req.user.id;

    if (!room_id || !user_id)
      throw new APIError(ReasonPhrases.BAD_REQUEST, StatusCodes.BAD_REQUEST);

    const listParticipants = await roomService.listParticipants(
      user_id,
      room_id
    );

    res.status(StatusCodes.OK).json(new Success(listParticipants));
  } catch (error) {
    next(error);
  }
};
