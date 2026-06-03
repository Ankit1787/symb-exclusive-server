import { Request, Response } from "express";
import productService from "../services/product.service.js";
import { CollectionType, IProduct } from "../models/product.model.js";
import { _discriminatedUnion } from "zod/v4/core";

export const getAllProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const products = await productService.getProducts();
    res.json({ success: true, data: products });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch products" });
  }
};

export const getProductDetails = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productId = req.params.id as string;
    const product = await productService.getProductDetails(productId);
    if (!product || !product?.category || !product?._id) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    const products = await productService.getSimilarProducts(
      product?.category,
      product?._id.toString(),
    );
    res.json({ success: true, data: {product,similarProducts:products} });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch product details" });
  }
};
export const getProductsByCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const category = req.params.category as string;
    const products = await productService.getProductsByCategory(category);
    res.json({ success: true, data: products });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch products by category",
      });
  }
};

export const getProductsByCollection = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const collection = req.params.collection as CollectionType;
    const products = await productService.getProductByCollection(collection);
    res.json({ success: true, data: products });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch products by collection",
      });
  }
};
export const createProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productData = req.body as IProduct[];
    const newProducts = await productService.createProduct(productData);
    res.status(201).json({ success: true, data: newProducts });
  } catch (error) {
    console.error("Error creating product:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create product" });
  }
};

export const getSimilarProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productId = req.params.id as string;
    const category = req.query.category as string;
    const similarProducts = await productService.getSimilarProducts(
      category,
      productId,
    );
    res.json({ success: true, data: similarProducts });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch similar products" });
  }
};
