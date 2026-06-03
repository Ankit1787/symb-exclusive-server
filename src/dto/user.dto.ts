import { Types } from "mongoose";
export interface LoginUserDto {
  email: string;
  password: string;
}
export interface AddressDto {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}
export interface RegisterUserDto {
  firstName: string;
  lastName: string;
  identifier:string,
  password: string;
  address?: AddressDto;
}
export interface RegisteredUserResponse {
  user: {
    id: Types.ObjectId;
    name: string;
    email: string;
  };
  token: string;
}
export interface UserProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?:string;
  address?: AddressDto;
  
}
