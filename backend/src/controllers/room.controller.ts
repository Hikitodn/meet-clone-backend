import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import { roomService } from "../services";
import { Success } from "../lib/api/apiControllerBase";

dotenv.config();

// create new room
export const createRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;
    const room_id = Math.random().toString(36).slice(2);
    const newRoom = await roomService.createRoom(user.id, room_id);
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
    const room_id = req.body.roomName;
    const user_id = req.user.id;
    const user_name = req.user.name;

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
    const room_id = req.params.room_id;
    const { user_id, user_name } = req.user;

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

// check participant
export const checkParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roomId = req.params.roomName;
    const participantId = req.user.uid;

    const result = await roomService.isParticipantOfRoom(roomId, participantId);

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
    const uid = req.user.uid;
    const listRooms = await roomService.listRooms(uid);
    res.status(StatusCodes.OK).json(new Success(listRooms));
  } catch (error) {
    next(error);
  }
};
