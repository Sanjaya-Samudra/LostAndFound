import { Request, Response } from "express";
import Item from "../models/Item";
import Notification from "../models/Notification";
import { AuthRequest } from "../middleware/auth";

export const getItems = async (req: Request, res: Response) => {
  const { search, category, type, status, location } = req.query;
  const filter: any = {};

  if (search) {
    filter.$or = [
      { title: { $regex: search as string, $options: "i" } },
      { description: { $regex: search as string, $options: "i" } },
    ];
  }

  if (category) {
    filter.category = category as string;
  }

  if (type) {
    filter.type = type as string;
  }

  if (status) {
    filter.status = status as string;
  }

  if (location) {
    filter.location = { $regex: location as string, $options: "i" };
  }

  const items = await Item.find(filter).populate("postedBy", "firstName lastName");
  res.json(items);
};

export const getMyItems = async (req: AuthRequest, res: Response) => {
  const items = await Item.find({ postedBy: req.user?.id }).populate("postedBy", "firstName lastName");
  res.json(items);
};

export const getItemById = async (req: Request, res: Response) => {
  const item = await Item.findById(req.params.id).populate("postedBy", "-password");
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }
  res.json(item);
};

export const createItem = async (req: AuthRequest, res: Response) => {
  const item = await Item.create({ ...req.body, postedBy: req.user?.id });
  const populated = await Item.findById(item._id).populate("postedBy", "firstName lastName");
  res.status(201).json(populated || item);
};

export const updateItem = async (req: AuthRequest, res: Response) => {
  const existing = await Item.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: "Item not found" });
  }

  if (existing.postedBy?.toString() !== req.user?.id && req.user?.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
  }

  const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (item && item.status === "resolved" && item.postedBy) {
    await Notification.create({
      user: item.postedBy,
      type: "resolved",
      message: `Your item "${item.title}" has been marked as resolved/claimed.`,
      itemId: item._id,
    });
  }

  res.json(item);
};

export const deleteItem = async (req: AuthRequest, res: Response) => {
  const existing = await Item.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: "Item not found" });
  }

  if (existing.postedBy?.toString() !== req.user?.id && req.user?.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
  }

  await Item.findByIdAndDelete(req.params.id);

  res.json({ message: "Item Deleted" });
};
