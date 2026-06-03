import {
  RegisteredUserResponse,
  RegisterUserDto,
  UserProfileRequest,
} from "../dto/user.dto.js";
import { createUser, findUserByEmailOrPhoneNumber, findUserById, updateUserById } from "../repositories/user.repository.js";
import { comparePassword } from "../utils/bcryptjs.js";
import generateToken from "../utils/jwt.js";
import * as z from "zod";
export const registerUser = async (
  userData: RegisterUserDto,
): Promise<RegisteredUserResponse> => {
   const { identifier, firstName,lastName, password } = userData;
  const isEmail = z.email().safeParse(identifier).success;

  const isPhone = /^[6-9]\d{9}$/.test(identifier);

  const obj: any = {
    firstName,
    lastName,
    password,
  };

  if (isEmail) {
    obj.email = identifier;
  }

  if (isPhone) {
    obj.phoneNumber = identifier;
  }
  const user = await createUser(obj);
  const token = generateToken(user._id);
  return {
    user: {
      id: user._id,
      name: user.firstName + " " + user.lastName,
      email: user.email,
    },
    token,
  };
};

export const loginUser = async (
  identifier: string,
  password: string,
): Promise<RegisteredUserResponse> => {
  // Implement login logic here
  // This is a placeholder - replace with actual user authentication logic
  const user = await findUserByEmailOrPhoneNumber(identifier);
  if (!user) {
    throw new Error("User not found");
  }
  const passwordMatches = comparePassword(password, user.password);
  if (!passwordMatches) {
    throw new Error("Invalid password");
  }
  const token = generateToken(user._id);
  return {
    user: {
      id: user._id,
      name: user.firstName + " " + user.lastName,
      email: user.email,
    },
    token,
  };
};
export const getUserProfile = async (userId: string | undefined) => {
  if (!userId) {
    throw new Error("User not found");
  }
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
export const updateUserProfile = async (
  userId: string | undefined,
  updateData: UserProfileRequest,
) => {
  if (!userId) {
    throw new Error("User not found");
  }
  const updatedUser = await findUserById(userId);
  if (!updatedUser) {
    throw new Error("User not found");
  }
  const updatedUserData = await updateUserById(userId, updateData);
  return updatedUserData;
};
