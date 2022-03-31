import { Request, Response, NextFunction } from "express";
import { authController } from "../../controllers";

export const verify = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.session);
  next();
};
