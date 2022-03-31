import { APIError } from "../lib/api/apiControllerBase";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import AppDataSource from "../configs/db.config";
import { User } from "../entities";
import { IUser } from "../interfaces";

const userRepo = AppDataSource.getRepository(User);

export const findOrCreate = async (user: IUser) => {
  const currentUser = await userRepo.findOneBy({ email: user.email });

  if (currentUser) {
    return currentUser;
  }

  const newUser = await userRepo.create(user);

  return await userRepo.save(newUser);
};

export const getUserById = async (user_id) => {
  const user = await userRepo.findOneBy({ id: user_id });
  if (!user)
    throw new APIError(
      ReasonPhrases.NOT_FOUND,
      StatusCodes.NOT_FOUND,
      "User not found"
    );

  return user;
};
