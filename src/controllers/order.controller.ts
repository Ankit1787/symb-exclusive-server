import { Request, Response } from "express";
import {
  getOrder,
  getOrders,
  getOrdersByStatusService,
  getUserOrders,
  placeNewOrder,
  removeOrder,
  updateOrderStatusService,
  updatePaymentStatusService,
} from "../services/order.service.js";
import { IOrder, OrderDocument } from "../models/order.model.js";
import { getOrdersByUserId } from "../repositories/order.repository.js";

export const createOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const orderData = req.body;
    const userId = req.user?.id as string;
    let payload = {
      ...orderData,
      userId: userId,
      orderId: `EX-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      orderTimeline: [
        {
          title: "Order Placed",
          date: new Date().toLocaleDateString(),
          description: "Your order has been successfully placed.",
        },
      ],
        status: "pending",
      paymentStatus: "pending",
    };
    const newOrder = await placeNewOrder(payload);
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to place order",
    });
  }
};

export const fetchUserOrders = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id as string;
    const orders = await getUserOrders(userId);
    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

export const fetchAllOrders = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id as string;
    const orders = await getOrdersByUserId(userId);
    res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

export const fetchOrderById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const orderId = req.params.orderId as string;
    const order = await getOrder(orderId);
    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const orderId = req.params.orderId as string;
    const { status } = req.body;
    const updatedOrder = await updateOrderStatusService(orderId, status);
    if (!updatedOrder) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

export const updatePaymentStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const orderId = req.params.orderId as string;
    const { paymentStatus } = req.body;
    const updatedOrder = await updatePaymentStatusService(
      orderId,
      paymentStatus,
    );
    if (!updatedOrder) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update payment status",
    });
  }
};

export const deleteOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const orderId = req.params.orderId as string;
    const deletedOrder = await removeOrder(orderId);
    if (!deletedOrder) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      data: deletedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete order",
    });
  }
};

export const getOrdersByStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const status = req.params.status as IOrder["status"];
    const userId= req.user?.id as string;
    const orders = await getOrdersByStatusService(status,userId);
    res.status(200).json({
      success: true,
      message: `Orders with status '${status}' fetched successfully`,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};
