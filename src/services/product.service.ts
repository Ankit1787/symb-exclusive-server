import { CollectionType, IProduct, ProductDocument } from "../models/product.model.js";
import { getAllProducts, getProductByCategory, getProductById, createNewProduct,getSimilarProduct, getProductByCollections } from "../repositories/product.repository.js";

export const getProducts = async (): Promise<ProductDocument[]> => {
  const products = await getAllProducts();
  return products;
};

export const getProductDetails = async (productId: string): Promise<ProductDocument | null> => {
  const product = await getProductById(productId);
  return product;
}
export const getProductsByCategory = async (category: string): Promise<ProductDocument[]> => {
    const products = await getProductByCategory(category);
    return products;
}
export const getProductByCollection = async (collection: CollectionType): Promise<ProductDocument[]> => {
    const products = await getProductByCollections(collection);
    return products;
}

export const getSimilarProducts = async (category: string, excludeId: string): Promise<ProductDocument[]> => {
  const similarProducts = await getSimilarProduct(category, excludeId);
  return similarProducts;
}  

export const createProduct = async (productData: IProduct[]): Promise<ProductDocument[]> => {
const data = productData
  .filter(product => product.images && product.images.length > 2)
  .map(product => ({
    ...product,
    mrp: Math.round(
      (product.price * 100) /
      (100 - product.discountPercentage)
    )
  }));  
  const newProducts = await createNewProduct(data);
  return newProducts;
}

export default {
    getProducts,
    getProductDetails,
    getProductsByCategory,
    getProductByCollection,
    createProduct,
    getSimilarProducts
}