import express from "express";
import { getProducts, updateProduct } from "../controllers/products.js";

const router = express.Router();

router.get("/products", getProducts);

router.put("/products/atualizar", updateProduct);

export default router;
