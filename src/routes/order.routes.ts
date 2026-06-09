import { Router } from "express";
import {
    createOrder,
    deleteOrder,
    fetchAllOrders,
    fetchOrderById,
    fetchUserOrders,
    getOrdersByStatus,
    updateOrderStatus,
    updatePaymentStatus,
} from "../controllers/order.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Place new order
router.post("/create",authMiddleware, createOrder);

// Get all orders
router.get("/",authMiddleware,  fetchAllOrders);

// Get orders by user ID
router.get("/user/:userId", fetchUserOrders);

// Get orders by status
router.get("/status/:status", getOrdersByStatus);

// Get specific order
router.get("/:orderId", fetchOrderById);

// Update order status
router.put("/:orderId/status", updateOrderStatus);

// Update payment status
router.put("/:orderId/payment-status", updatePaymentStatus);

// Delete order
router.delete("/:orderId", deleteOrder);

export default router;
