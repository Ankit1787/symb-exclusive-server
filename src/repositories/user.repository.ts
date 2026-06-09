import { RegisterUserDto, UserProfileRequest } from "../dto/user.dto.js";
import UserModel, { UserDocument } from "../models/user.model.js";
import ProductModel from "../models/product.model.js";
import { hashPassword } from "../utils/bcryptjs.js";

interface Color {
  name: string;
  code: string;
}

interface Variant {
  sku: string;
  color: Color;
  size: string;
  stock: number;
}

const generateVariants = (
  productCode: string,
  colors: Color[],
  sizes: string[],
): Variant[] => {
  return colors.flatMap((color) =>
    sizes.map((size) => ({
      sku: `${productCode}-${color.name.substring(0, 3).toUpperCase()}-${size}`,

      color,

      size,

      stock: Math.floor(Math.random() * 20) + 1,
    })),
  );
};
export const createUser = async (
  userData: RegisterUserDto,
): Promise<UserDocument> => {
   userData.password = await hashPassword(userData.password);
  return UserModel.create(userData);
};

export const findUserByEmailOrPhoneNumber = async (
  identifier: string,
): Promise<UserDocument | null> => {
  return UserModel.findOne({
    $or: [{ email: identifier }, { phoneNumber: identifier }],
  });
};

export const findUserByEmail = async (
  email: string,
): Promise<UserDocument | null> => {
  return UserModel.findOne({ email });
};

export const findUserById = async (
  id: string,
): Promise<UserDocument | null> => {
  return UserModel.findById(id);
};
export const updateUserPassword = async (
  id: string,
  password: string,
): Promise<UserDocument | null> => {
  return UserModel.findByIdAndUpdate(
    id,
    { $set: { password } },
    { new: true },
  );
};
export const updateUserById = async (
  id: string,
  updateData: UserProfileRequest,
): Promise<UserDocument | null> => {
  return UserModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true },
  ).select("-password");
};

const creteaVar = async () => {
  const res = await ProductModel.find({});
  for (let i = 0; i < res.length; i++) {
    let varaints = generateVariants(
      res[i].title
        .replace(/[^a-zA-Z]/g, "")
        .substring(0, 8)
        .toUpperCase(),

      [
        { name: "Black", code: "#000000" },
        { name: "White", code: "#FFFFFF" },
        { name: "Blue", code: "#2563EB" },
      ],

      ["S", "M", "L", "XL"],
    );
    console.log(varaints?.length)

    let product = await ProductModel.findByIdAndUpdate(
    res[i]._id,
    { $set: { variants: varaints } },
    { new: true },
  );
  }
  console.log("updated")
};
