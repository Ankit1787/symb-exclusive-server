import { HydratedDocument } from "mongoose";
import { InferSchemaType } from "mongoose";
import { Schema, model } from "mongoose";
export interface IAddress {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber:string;
  password: string;
  address?: IAddress;
  createdAt: Date;
  updatedAt: Date;
}
const addressSchema = new Schema<IAddress>({
  addressLine1: { type: String, },
  addressLine2: { type: String },
  city: { type: String, },
  state: { type: String, },
  postalCode: { type: String, },
  country: { type: String, },
});
const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber:{type:String},
    password: { type: String, required: true },
    address: { type: addressSchema },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
export type User = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<User>;
const UserModel = model<IUser>("User", userSchema);

export default UserModel;
