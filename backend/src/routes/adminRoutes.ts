import express from "express";
import {
  getStats,
  getUsers,
  updateUserRole,
  deleteUser,
  deleteItem,
  suspendUser,
  unsuspendUser,
  bulkDeleteItems,
  bulkDeleteUsers,
} from "../controllers/adminController";

import auth from "../middleware/auth";
import admin from "../middleware/admin";

const router = express.Router();

router.get("/stats", auth, admin, getStats);
router.get("/users", auth, admin, getUsers);

router.put("/users/:id", auth, admin, updateUserRole);
router.put("/users/:id/suspend", auth, admin, suspendUser);
router.put("/users/:id/unsuspend", auth, admin, unsuspendUser);

router.delete("/users/:id", auth, admin, deleteUser);
router.delete("/items/:id", auth, admin, deleteItem);
router.post("/bulk-delete-items", auth, admin, bulkDeleteItems);
router.post("/bulk-delete-users", auth, admin, bulkDeleteUsers);

export default router;
