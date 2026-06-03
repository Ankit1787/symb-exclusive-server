import { model, Schema, InferSchemaType, HydratedDocument } from "mongoose";

export type CollectionType =
  | "best-seller"
  | "new-arrival"
  | "flash-sale"
  | "featured";


export interface IProduct {
id: number,
title:string,
description: string,
category: string,
mrp: number,
price: number,
discountPercentage: number,
rating: number,
stock: number,
tags: string[],
collections?: CollectionType[];
brand: string,
warrantyInformation?: string,
shippingInformation?: string,
returnPolicy?: string,
images: [
string
],
thumbnail: string

}
const productSchema = new Schema<IProduct>({
id: { type: Number, required: true },
title: { type: String, required: true },
description: { type: String, required: true },  
category: { type: String, required: true },
mrp: { type: Number, required: true },
price: { type: Number, required: true },
discountPercentage: { type: Number, required: true },
rating: { type: Number, required: true },
stock: { type: Number, required: true },
tags: { type: [String],  },
brand: { type: String },  
collections: {
  type: [String],
  enum: [
    "best-seller",
    "new-arrival",
    "flash-sale",
    "featured"
  ],
  default: []
},
warrantyInformation: { type: String },
shippingInformation: { type: String },
returnPolicy: { type: String },
images: { type: [String] ,required: true},
thumbnail: { type: String ,required: true},
  
},{
    timestamps: true,
    versionKey: false
});

export type Product = InferSchemaType<typeof productSchema>;
export type  ProductDocument = HydratedDocument<Product>;
const ProductModel = model<IProduct>("Product", productSchema);

export default ProductModel;