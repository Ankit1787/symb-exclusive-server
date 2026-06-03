import {Router} from "express";
import { createProduct, getAllProducts, getProductDetails, getProductsByCategory, getProductsByCollection, getSimilarProducts } from "../controllers/product.controller.js";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductDetails);
router.get("/related/:id", getSimilarProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/collections/:collection", getProductsByCollection);
router.post("/create", createProduct);


export default router;
 