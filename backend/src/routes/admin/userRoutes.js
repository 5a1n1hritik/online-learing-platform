import express from "express";
import verifyAdmin from "../../middlewares/verifyAdmin.js";
import {
  deleteUser,
  getAllUsers,
  getUserDetails,
  updateUser,
} from "../../controllers/admin/user.controller.js";

const router = express.Router();

// managing users
router.get("/all-users", verifyAdmin, getAllUsers);
router.get("/:userId", verifyAdmin, getUserDetails);
router.put("/update-users/:userId", verifyAdmin, updateUser);
router.delete("/delete-users/:userId", verifyAdmin, deleteUser);

export default router;
