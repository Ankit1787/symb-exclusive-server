import { IOrder, OrderDocument } from "../models/order.model.js";
import {
    createOrder,
    deleteOrder,
    getAllOrders,
    getOrderById,
    getOrderByOrderId,
    getOrdersByStatus,
    getOrdersByUserId,
    updateOrderStatus,
    updatePaymentStatus,
} from "../repositories/order.repository.js";

export const placeNewOrder = async (orderData: IOrder): Promise<OrderDocument> => {

    const payload ={

    }
  return await createOrder(orderData);
};

export const getUserOrders = async (userId: string): Promise<OrderDocument[]> => {
  return await getOrdersByUserId(userId);
};

export const getOrders = async (): Promise<OrderDocument[]> => {
  return await getAllOrders();
};

export const getOrder = async (orderId: string): Promise<OrderDocument | null> => {
  return await getOrderByOrderId(orderId);
};

export const updateOrderStatusService = async (
  orderId: string,
  status: string,
): Promise<OrderDocument | null> => {
  return await updateOrderStatus(orderId, status);
};

export const updatePaymentStatusService = async (
  orderId: string,
  paymentStatus: string,
): Promise<OrderDocument | null> => {
  return await updatePaymentStatus(orderId, paymentStatus);
};

export const cancelOrder = async (orderId: string): Promise<OrderDocument | null> => {
  return await updateOrderStatus(orderId, "cancelled");
};

export const removeOrder = async (orderId: string): Promise<OrderDocument | null> => {
  return await deleteOrder(orderId);
};

export const getOrdersByStatusService = async (status: IOrder["status"]): Promise<OrderDocument[]> => {
  return await getOrdersByStatus(status);
};
