import { Types } from "mongoose";
import { RegisterUserDto, UserProfileRequest } from "../dto/user.dto.js";
import UserModel, { UserDocument } from "../models/user.model.js";

export const createUser = async (userData: RegisterUserDto): Promise<UserDocument>  => {
     return UserModel.create(userData);
};

export const findUserByEmailOrPhoneNumber = async (identifier: string): Promise<UserDocument | null> => {
    return UserModel.findOne({  $or: [
    { email: identifier },
    { phone: identifier }
  ] });
}
export const findUserById = async (id: string): Promise<UserDocument | null> => {
    return UserModel.findById(id).select("-password");
}
export const updateUserById = async (id: string, updateData: UserProfileRequest): Promise<UserDocument | null> => {
    return UserModel.findByIdAndUpdate(id, { $set: updateData }, { new: true }).select("-password");
}




