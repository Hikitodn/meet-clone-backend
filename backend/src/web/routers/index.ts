import { Router } from "express";
import apiRouter from "./api";

const rootRouter = Router();

//--- all: "./"
rootRouter.use("/api", apiRouter);

export default rootRouter;
