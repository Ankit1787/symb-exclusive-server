import { Request, Response } from "express";
import aiService, { ShoppingAssistantRequest } from "./ai.service.js";

export const getShoppingRecommendations = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const payload = req.body as ShoppingAssistantRequest;

    if (!payload.message || !payload.message.trim()) {
      res
        .status(400)
        .json({ success: false, message: "Message is required" });
      return;
    }

    const recommendations =
      await aiService.getShoppingRecommendations(payload);

    res.json({ success: true, data: recommendations });
  } catch (error) {
    console.error("AI shopping assistant error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate shopping recommendations",
    });
  }
};

export default {
  getShoppingRecommendations,
};
