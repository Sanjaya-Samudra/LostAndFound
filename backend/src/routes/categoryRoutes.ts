import express from "express";
import { getCategories, createCategory, deleteCategory } from "../controllers/categoryController";
import auth from "../middleware/auth";
import admin from "../middleware/admin";

const router = express.Router();

router.get("/", getCategories);
router.post("/", auth, admin, createCategory);
router.delete("/:id", auth, admin, deleteCategory);

export default router;
