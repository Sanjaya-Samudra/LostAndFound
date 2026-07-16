import express from "express";
import {
  getStats,
  getUsers,
  updateUserRole,
  deleteUser,
  deleteItem,
} from "../controllers/adminController";

import auth from "../middleware/auth";
import admin from "../middleware/admin";

const router = express.Router();

router.get("/stats", auth, admin, getStats);

router.get("/users", auth, admin, getUsers);

router.put("/users/:id", auth, admin, updateUserRole);

router.delete("/users/:id", auth, admin, deleteUser);

router.delete("/items/:id", auth, admin, deleteItem);

export default router;