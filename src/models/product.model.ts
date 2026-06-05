import { model, Schema, InferSchemaType, HydratedDocument } from "mongoose";

export type CollectionType =
  | "best-seller"
  | "new-arrival"
  | "flash-sale"
  | "featured";

export interface ProductColor {
  name: string;
  code: string;
}

export interface ProductVariant {
  color: ProductColor;
  size: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  stock: number;
  price?: number;
  discountPercentage?: number;
}

export interface IProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  mrp: number;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  collections?: CollectionType[];
  brand: string;
  warrantyInformation?: string;
  shippingInformation?: string;
  returnPolicy?: string;
  images: [string];
  thumbnail: string;
  variants: ProductVariant[];
}
const variantSchema = new Schema<ProductVariant>({
  color: {
    name: {
      type: String,
      required: true,
    },

    code: {
      type: String,
      required: true,
    },
  },

  size: {
    type: String,
    enum: ["XS", "S", "M", "L", "XL", "XXL"],
    required: true,
  },

  stock: {
    type: Number,
    default: 0,
    min: 0,
  },

  price: {
    type: Number,
    min: 0,
  },
  discountPercentage: {
    type: Number,
    min: 0,
  },
});
const productSchema = new Schema<IProduct>(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    mrp: { type: Number, required: true },
    price: { type: Number, required: true },
    discountPercentage: { type: Number, required: true },
    rating: { type: Number, required: true },
    stock: { type: Number, required: true },
    tags: { type: [String] },
    brand: { type: String },
    collections: {
      type: [String],
      enum: ["best-seller", "new-arrival", "flash-sale", "featured"],
      default: [],
    },
    variants: [variantSchema],
    warrantyInformation: { type: String },
    shippingInformation: { type: String },
    returnPolicy: { type: String },
    images: { type: [String], required: true },
    thumbnail: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export type Product = InferSchemaType<typeof productSchema>;
export type ProductDocument = HydratedDocument<Product>;
const ProductModel = model<IProduct>("Product", productSchema);

export default ProductModel;
