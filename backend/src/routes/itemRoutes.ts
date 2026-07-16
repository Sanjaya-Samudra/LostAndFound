import express from "express";
import {
  getItems,
  getMyItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/itemController";

import auth from "../middleware/auth";

const router = express.Router();

router.get("/", getItems);
router.get("/my", auth, getMyItems);
router.get("/:id", getItemById);

router.post("/", auth, createItem);
router.put("/:id", auth, updateItem);
router.delete("/:id", auth, deleteItem);

export default router;
