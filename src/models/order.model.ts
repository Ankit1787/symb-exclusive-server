import { HydratedDocument, Schema, model, InferSchemaType } from "mongoose";

export interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  thumbnail?: string;
  variant?: {
    color:string;
    size:string;
  };
}
export interface orderTimeline{
    title?:string,
    date?:string,
    description?:string
}

export interface IOrder {
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
    email: string;
  };
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  paymentStatus: "pending" | "completed" | "failed";
  notes?: string;
  orderId:string;
  orderTimeline?:orderTimeline[]
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<OrderItem>({
  productId: { type: String, required: true },
  title: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  thumbnail: { type: String },
  variant: { type: Schema.Types.Mixed },
});

const shippingAddressSchema = new Schema({
  fullName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
});

const orderTimelineSchema = new Schema({
   title:String,
    date:String,
    description:String

});

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    shippingAddress: { type: shippingAddressSchema, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    notes: { type: String },
    orderId:{type:String,required:true,unique:true},
   orderTimeline:[orderTimelineSchema]
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export type Order = InferSchemaType<typeof orderSchema>;
export type OrderDocument = HydratedDocument<Order>;
const OrderModel = model<IOrder>("Order", orderSchema);

export default OrderModel;
