import { Router } from "express";
import { roomController, authController } from "../../../../controllers";

const roomRouter = Router();

// // all: "./api/room"
roomRouter.use("/*", authController.verifyUser);
roomRouter.get("/get-token/:room_id", roomController.getToken);
roomRouter.post("/create-room", roomController.createRoom);
roomRouter.get("/req-join-room/:room_id", roomController.reqJoinRoom);
roomRouter.post("/res-join-room", roomController.resJoinRoom);
// roomRouter.get("/update-participant", roomController.);
roomRouter.get("/list-room", roomController.listRooms);
roomRouter.delete("/delete-room/:room_id", roomController.deleteRoom);
roomRouter.get("/is-room-master/:room_id", roomController.isRoomMaster);
roomRouter.get("/is-participant/:room_id", roomController.isParticipantOfRoom);
roomRouter.get("/list-participant/:room_id", roomController.listParticipants);
roomRouter.get("/exits-room/:room_id", roomController.exitsRoom);

export default roomRouter;
