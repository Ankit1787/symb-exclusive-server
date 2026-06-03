import {
  RegisteredUserResponse,
  RegisterUserDto,
  UserProfileRequest,
} from "../dto/user.dto.js";
import { createUser, findUserByEmailOrPhoneNumber, findUserById } from "../repositories/user.repository.js";
import { comparePassword, hashPassword } from "../utils/bcryptjs.js";
import generateToken from "../utils/jwt.js";
import * as z from "zod";
export const registerUser = async (
  userData: RegisterUserDto,
): Promise<RegisteredUserResponse> => {
  const { identifier, firstName, lastName, password } = userData;
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

  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Password update requested
  if (
    updateData.currentPassword ||
    updateData.newPassword ||
    updateData.confirmPassword
  ) {
    if (
      !updateData.currentPassword ||
      !updateData.newPassword ||
      !updateData.confirmPassword
    ) {
      throw new Error("All password fields are required");
    }

    const passwordMatches = comparePassword(
      updateData.currentPassword,
      user.password,
    );

    if (!passwordMatches) {
      throw new Error("Current password is incorrect");
    }

    if (updateData.newPassword !== updateData.confirmPassword) {
      throw new Error("Passwords do not match");
    }
    user.password = await hashPassword(updateData.newPassword);
  }

  if (updateData.firstName) user.firstName = updateData.firstName;
  if (updateData.lastName) user.lastName = updateData.lastName;
  if (updateData.email) user.email = updateData.email;
  if (updateData.address) user.address = updateData.address;

  await user.save();

  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    address: user.address,
  };
};
