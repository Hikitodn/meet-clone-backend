import { auth } from "../configs/firebase.config";
import { APIError } from "../lib/api/apiControllerBase";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { userService } from "../services";
import { Success } from "../lib/api/apiControllerBase";

export const verifyUserWithGoogle = async (idToken: string): Promise<any> => {
  try {
    const user = await auth.verifyIdToken(idToken);
    if (!user)
      throw new APIError(
        ReasonPhrases.UNAUTHORIZED,
        StatusCodes.UNAUTHORIZED,
        "User is not authorized"
      );

    const USER = {
      name: user.name,
      picture: user.picture,
      email: user.email,
    };

    return await userService.findOrCreate(USER);
  } catch (error) {
    throw error;
  }
};

export const verifyUser = async (user_id) => {
  try {
    const user = await userService.getUserById(user_id);
    if (!user)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "User not found"
      );

    return user;
  } catch (error) {
    throw error;
  }
};
