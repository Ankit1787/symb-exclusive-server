export interface OrderItemDto {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  variant?: {
    color?: string;
    size?: string;
  };
}

export interface ShippingAddressDto {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PlaceOrderDto {
  userId: string;
  items: OrderItemDto[];
  totalAmount: number;
  shippingAddress: ShippingAddressDto;
  paymentMethod: string;
  notes?: string;
}

export interface UpdateOrderStatusDto {
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
}

export interface UpdatePaymentStatusDto {
  paymentStatus: "pending" | "completed" | "failed";
}
