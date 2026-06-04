import ProductModel, { CollectionType, IProduct, ProductDocument } from "../models/product.model.js";

export const getAllProducts = async (): Promise<ProductDocument[]> => {
    return await ProductModel.find();
};
export const getProductById = async (id: string): Promise<ProductDocument | null> => {
    return await ProductModel.findById(id);
};
export const getProductByCategory = async (category: string): Promise<ProductDocument[]> => {
    return await ProductModel.find({ category });
};
export const createNewProduct = async (productData: IProduct[]): Promise<ProductDocument[]> => {
    return await ProductModel.insertMany(productData);
};
export const getSimilarProduct = async (category: string, excludeId: string): Promise<ProductDocument[]> => {
    return await ProductModel.find({ category, _id: { $ne: excludeId } }).limit(5);
};
export const getProductByCollections=async (collection:CollectionType): Promise<ProductDocument[]> => {
      const query = collection
    ? { collections: collection }
    : {};

    return await ProductModel.find(query)

};
export const searchProducts = async (term: string): Promise<ProductDocument[]> => {
    const regex = new RegExp(term, "i");
    return await ProductModel.find({
        $or: [
            { title: regex },
            { category: regex },
            { tags: regex },
            { brand: regex }
        ]
    }).limit(50);
};
// updateCategory()