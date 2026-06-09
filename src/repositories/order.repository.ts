import OrderModel, { IOrder, OrderDocument } from "../models/order.model.js";

export const createOrder = async (orderData: IOrder): Promise<OrderDocument> => {
  return await OrderModel.create(orderData);
};

export const getOrderById = async (orderId: string): Promise<OrderDocument | null> => {
  return await OrderModel.findById(orderId);
};

export const getOrderByOrderId = async (orderId: string): Promise<OrderDocument | null> => {
  return await OrderModel.findOne({orderId});
};

export const getOrdersByUserId = async (userId: string): Promise<OrderDocument[]> => {
  return await OrderModel.find({ userId }).sort({ createdAt: -1 });
};

export const getAllOrders = async (): Promise<OrderDocument[]> => {
  return await OrderModel.find().sort({ createdAt: -1 });
};

export const updateOrderStatus = async (
  orderId: string,
  status: string,
): Promise<OrderDocument | null> => {
  return await OrderModel.findByIdAndUpdate(
    orderId,
    { status },
    { new: true },
  );
};

export const updatePaymentStatus = async (
  orderId: string,
  paymentStatus: string,
): Promise<OrderDocument | null> => {
  return await OrderModel.findByIdAndUpdate(
    orderId,
    { paymentStatus },
    { new: true },
  );
};

export const deleteOrder = async (orderId: string): Promise<OrderDocument | null> => {
  return await OrderModel.findByIdAndDelete(orderId);
};

export const getOrdersByStatus = async (status: IOrder["status"],userId:string): Promise<OrderDocument[]> => {
  return await OrderModel.find({ status,userId }).sort({ createdAt: -1 });
};
