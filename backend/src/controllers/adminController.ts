import { Request, Response } from "express";
import User from "../models/User";
import Item from "../models/Item";
import Claim from "../models/Claim";
import Report from "../models/Report";
import { AuthRequest } from "../middleware/auth";
import { createLog } from "./activityLogController";

export const getStats = async (req: AuthRequest, res: Response) => {
  const totalUsers = await User.countDocuments();
  const totalItems = await Item.countDocuments();
  const lostCount = await Item.countDocuments({ type: "lost" });
  const foundCount = await Item.countDocuments({ type: "found" });
  const resolvedCount = await Item.countDocuments({ status: "resolved" });
  const archivedCount = await Item.countDocuments({ status: "archived" });
  const suspendedCount = await User.countDocuments({ suspended: true });
  const claimsCount = await Claim.countDocuments();
  const pendingClaims = await Claim.countDocuments({ status: "pending" });
  const reportsCount = await Report.countDocuments({ status: "open" });

  res.json({
    totalUsers,
    totalItems,
    lostCount,
    foundCount,
    resolvedCount,
    archivedCount,
    suspendedCount,
    claimsCount,
    pendingClaims,
    reportsCount,
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

  await createLog(
    String(req.user.id),
    String(req.user.name || "Admin"),
    "update_user_role",
    "user",
    String(req.params.id),
    `${user.firstName} ${user.lastName}`.trim(),
    `Role changed to ${role}`
  );

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

  await createLog(
    String(req.user.id),
    String(req.user.name || "Admin"),
    "delete_user",
    "user",
    String(req.params.id),
    `${user.firstName} ${user.lastName}`.trim()
  );

  res.json({ message: "User Deleted" });
};

export const deleteItem = async (req: AuthRequest, res: Response) => {
  const item = await Item.findByIdAndDelete(req.params.id);

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  await createLog(
    String(req.user.id),
    String(req.user.name || "Admin"),
    "delete_item",
    "item",
    String(req.params.id),
    item.title
  );

  res.json({ message: "Item Deleted" });
};

export const suspendUser = async (req: AuthRequest, res: Response) => {
  if (req.params.id === req.user?.id) return res.status(400).json({ message: "Cannot suspend yourself" });
  const user = await User.findByIdAndUpdate(req.params.id, { suspended: true }, { new: true }).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  await createLog(String(req.user.id), String(req.user.name || "Admin"), "suspend_user", "user", String(req.params.id), `${user.firstName} ${user.lastName}`.trim());
  res.json(user);
};

export const unsuspendUser = async (req: AuthRequest, res: Response) => {
  const user = await User.findByIdAndUpdate(req.params.id, { suspended: false }, { new: true }).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  await createLog(String(req.user.id), String(req.user.name || "Admin"), "unsuspend_user", "user", String(req.params.id), `${user.firstName} ${user.lastName}`.trim());
  res.json(user);
};

export const bulkDeleteItems = async (req: AuthRequest, res: Response) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) return res.status(400).json({ message: "ids array required" });
  const result = await Item.deleteMany({ _id: { $in: ids } });
  await createLog(String(req.user.id), String(req.user.name || "Admin"), "bulk_delete_items", "item", "", `${result.deletedCount} items`);
  res.json({ deleted: result.deletedCount });
};

export const bulkDeleteUsers = async (req: AuthRequest, res: Response) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) return res.status(400).json({ message: "ids array required" });
  const result = await User.deleteMany({ _id: { $in: ids, $ne: req.user?.id } });
  await createLog(String(req.user.id), String(req.user.name || "Admin"), "bulk_delete_users", "user", "", `${result.deletedCount} users`);
  res.json({ deleted: result.deletedCount });
};
