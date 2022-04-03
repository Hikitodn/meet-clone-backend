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

export default roomRouter;
