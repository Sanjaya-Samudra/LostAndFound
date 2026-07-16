import { Request, Response } from "express";
import User from "../models/User";
import Item from "../models/Item";
import { AuthRequest } from "../middleware/auth";

export const getStats = async (req: AuthRequest, res: Response) => {
  const totalUsers = await User.countDocuments();
  const totalItems = await Item.countDocuments();
  const lostCount = await Item.countDocuments({ type: "lost" });
  const foundCount = await Item.countDocuments({ type: "found" });
  const resolvedCount = await Item.countDocuments({ status: "resolved" });

  res.json({
    totalUsers,
    totalItems,
    lostCount,
    foundCount,
    resolvedCount,
  });
};

export const getUsers = async (req: Request, res: Response) => {
  const { search } = req.query;
  const filter: any = {};

  if (search) {
    filter.$or = [
      { firstName: { $regex: search as string, $options: "i" } },
      { lastName: { $regex: search as string, $options: "i" } },
      { email: { $regex: search as string, $options: "i" } },
    ];
  }

  const users = await User.find(filter).select("-password");
  res.json(users);
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  const { role } = req.body;

  if (req.params.id === req.user?.id) {
    return res.status(400).json({ message: "Cannot change your own role" });
  }

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  if (req.params.id === req.user?.id) {
    return res.status(400).json({ message: "Cannot delete yourself" });
  }

  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ message: "User Deleted" });
};

export const deleteItem = async (req: AuthRequest, res: Response) => {
  const item = await Item.findByIdAndDelete(req.params.id);

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  res.json({ message: "Item Deleted" });
};
