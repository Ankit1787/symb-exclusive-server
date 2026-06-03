import  Router from "express";
import { getProfile, login, register, updateProfile } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.middlware.js";
import { loginUserSchema, registerUserSchema, updateProfileSchema } from "../validators/user.validator.js";
const router = Router();


router.post("/register",validateRequest(registerUserSchema), register);
router.post("/login", validateRequest(loginUserSchema), login);
router.get("/profile",authMiddleware, getProfile);
router.put("/update-profile", authMiddleware, validateRequest(updateProfileSchema), updateProfile);

export default router;