import { Router } from "express";
import roomRouter from "./room/room.router";
import authRouter from "./auth/auth.router";

const apiRouter = Router();
// all: ./api
apiRouter.use("/room", roomRouter);
apiRouter.use("/auth", authRouter);

export default apiRouter;
