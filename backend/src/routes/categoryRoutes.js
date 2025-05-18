import express from "express";

import { verifyToken } from "../middlewares/verifyToken.js";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../controllers/category.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createCategory); 
router.get("/categories", getAllCategories); 
router.get("/:id", getCategoryById); 
router.put("/:id/update", verifyToken, updateCategory); 
router.delete("/:id/delete", verifyToken, deleteCategory); 

export default router;
