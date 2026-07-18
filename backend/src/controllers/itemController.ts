import { Request, Response } from "express";
import Item from "../models/Item";
import User from "../models/User";
import Notification from "../models/Notification";
import { AuthRequest } from "../middleware/auth";
import { createLog } from "./activityLogController";

export const getItems = async (req: Request, res: Response) => {
  const { search, category, type, status, location, sort, dateFrom, dateTo, page, limit } = req.query;
  const filter: any = { status: { $ne: "archived" } };

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

  if (status && status !== "open") {
    filter.status = status as string;
  }

  if (location) {
    filter.location = { $regex: location as string, $options: "i" };
  }

  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) filter.createdAt.$gte = new Date(dateFrom as string);
    if (dateTo) filter.createdAt.$lte = new Date(dateTo as string);
  }

  let sortOption: any = { createdAt: -1 };
  if (sort === "oldest") sortOption = { createdAt: 1 };
  else if (sort === "title") sortOption = { title: 1 };

  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 50;
  const skip = (pageNum - 1) * limitNum;

  const items = await Item.find(filter)
    .populate("postedBy", "firstName lastName")
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);

  const total = await Item.countDocuments(filter);

  res.json({ items, total, page: pageNum, pages: Math.ceil(total / limitNum) });
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

  if (existing.postedBy?.toString() !== req.user?.id && req.user?.role === "admin") {
    await createLog(
      String(req.user.id),
      String(req.user.name || "Admin"),
      "edit_item",
      "item",
      String(req.params.id),
      item?.title || existing.title
    );
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

export const toggleBookmark = async (req: AuthRequest, res: Response) => {
  const itemId = req.params.id;
  const user = await User.findById(req.user?.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const idx = user.bookmarks.indexOf(itemId as any);
  if (idx > -1) {
    user.bookmarks.splice(idx, 1);
    await user.save();
    return res.json({ bookmarked: false });
  } else {
    user.bookmarks.push(itemId as any);
    await user.save();
    return res.json({ bookmarked: true });
  }
};

export const getBookmarks = async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?.id).populate("bookmarks");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user.bookmarks);
};

export const getExpiringItems = async (req: AuthRequest, res: Response) => {
  const items = await Item.find({
    expiresAt: { $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    status: "open",
  });
  res.json(items);
};

export const archiveExpired = async (req: AuthRequest, res: Response) => {
  const result = await Item.updateMany(
    { expiresAt: { $lte: new Date() }, status: "open" },
    { status: "archived" }
  );
  res.json({ archived: result.modifiedCount });
};
