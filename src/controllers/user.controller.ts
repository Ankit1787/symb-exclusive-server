import { Request, Response } from "express";
import { getUserProfile, loginUser, registerUser, updateUserProfile } from "../services/user.service.js";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await registerUser(req.body);
    res
      .status(201)
      .json({
        success: true,
        message: "User registered successfully",
        data: response,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to register user" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body;
    const response = await loginUser(identifier, password);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: response,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to login user" });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try{
        const userId = req.user?.id; // Assuming userId is set in the request by authentication middleware
        const user = await getUserProfile(userId);
        res.status(200).json({
            success: true,
            message: "User profile retrieved successfully",
            data: user,
        });
    }
    catch(error){
        res.status(500).json({ success: false, message: "Failed to get user profile" });
    }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try{
        const userId = req.user?.id;
        const updateData = req.body;
        const updatedUser = await updateUserProfile(userId, updateData);
        res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            data: updatedUser,
        });
    }
    catch(error){
        res.status(500).json({ success: false, message: "Failed to update user profile" });
    }
};
