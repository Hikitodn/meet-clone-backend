import { Router } from "express";
import { roomController, authController } from "../../../../controllers";

const roomRouter = Router();

// // all: "./api/room"
roomRouter.use("/*", authController.verifyUser);
roomRouter.post("/get-token", roomController.getToken);
roomRouter.get("/create-room", roomController.createRoom);
roomRouter.post("/list-room", roomController.reqJoinRoom);
roomRouter.get("/req-join-room/:roomId", roomController.reqJoinRoom);
roomRouter.post("/res-join-room", roomController.resJoinRoom);
// roomRouter.get("/update-participant", roomController.);
roomRouter.get("/list-room", roomController.listRooms);

export default roomRouter;
