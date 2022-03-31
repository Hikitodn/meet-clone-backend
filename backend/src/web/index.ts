import { Application } from "express";
import rootRouter from "./routers";
import { errorHandler, returnError } from "./middlewares/errorHandler";

const webApp = (app: Application) => {
  app.use("/", rootRouter);
  app.use(errorHandler);
  app.use(returnError);
};

export default webApp;
