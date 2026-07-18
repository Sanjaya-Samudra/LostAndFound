import express from "express";
import {
  getItems,
  getMyItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  toggleBookmark,
  getBookmarks,
  getExpiringItems,
  archiveExpired,
} from "../controllers/itemController";

import auth from "../middleware/auth";
import admin from "../middleware/admin";

const router = express.Router();

router.get("/", getItems);
router.get("/my", auth, getMyItems);
router.get("/bookmarks", auth, getBookmarks);
router.get("/expiring", auth, getExpiringItems);
router.get("/:id", getItemById);

router.post("/", auth, createItem);
router.put("/:id", auth, updateItem);
router.put("/:id/bookmark", auth, toggleBookmark);
router.delete("/:id", auth, deleteItem);

router.post("/archive-expired", auth, admin, archiveExpired);

export default router;
