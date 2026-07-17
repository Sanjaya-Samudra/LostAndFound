import { Response } from "express";
import Category from "../models/Category";
import { AuthRequest } from "../middleware/auth";

export const getCategories = async (req: AuthRequest, res: Response) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  const existing = await Category.findOne({ name: req.body.name });
  if (existing) return res.status(400).json({ message: "Category already exists" });
  const category = await Category.create({ name: req.body.name });
  res.status(201).json(category);
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
};
