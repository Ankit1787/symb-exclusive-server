import  Router from "express";
import { forgotPassword, getProfile, login, register, resetPassword, updateProfile } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.middlware.js";
import {
  forgotPasswordSchema,
  loginUserSchema,
  registerUserSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from "../validators/user.validator.js";
const router = Router();


router.post("/register",validateRequest(registerUserSchema), register);
router.post("/login", validateRequest(loginUserSchema), login);
router.post("/forgot-password", validateRequest(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validateRequest(resetPasswordSchema), resetPassword);
router.get("/profile",authMiddleware, getProfile);
router.put("/update-profile", authMiddleware, validateRequest(updateProfileSchema), updateProfile);

export default router;