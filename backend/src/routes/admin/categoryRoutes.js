import express from "express";
import verifyAdmin from "../../middlewares/verifyAdmin.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../../controllers/admin/category.controller.js";

const router = express.Router();

// managing category
router.post("/create", verifyAdmin, createCategory);
router.get("/all", getAllCategories);
router.get("/:categoryId", getCategoryById);
router.put("/:categoryId/update", verifyAdmin, updateCategory);
router.delete("/:categoryId/delete", verifyAdmin, deleteCategory);

export default router;
