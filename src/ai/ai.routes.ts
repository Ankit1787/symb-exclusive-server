import { Router } from "express";
import { getShoppingRecommendations } from "./ai.controller.js";

const router = Router();

router.post("/shopping/recommendations", getShoppingRecommendations);

export default router;
