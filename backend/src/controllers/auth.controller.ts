import { Request, Response, NextFunction } from "express";
import { authService } from "../services";
import { Success, APIError } from "../lib/api/apiControllerBase";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

declare module "express-session" {
  interface Session {
    user_id: string;
  }
}

declare module "express" {
  interface Request {
    user: any;
  }
}

// login with google
export const loginWithGoogle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id_token = req.body.id_token.toString();

    const user = await authService.verifyUserWithGoogle(id_token);

    req.session.user_id = user.id;

    res.status(StatusCodes.OK).json(new Success(user));
  } catch (error) {
    next(error);
  }
};

// Verify User
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.session;

    if (!user_id)
      throw new APIError(
        ReasonPhrases.UNAUTHORIZED,
        StatusCodes.UNAUTHORIZED,
        "User is not authorized"
      );

    const user = await authService.verifyUser(user_id);

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.user = null;
    req.session = null;
    res.status(StatusCodes.OK).json(new Success(true));
  } catch (error) {
    next(error);
  }
};
