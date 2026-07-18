import { Response } from "express";
import Notification from "../models/Notification";
import { AuthRequest } from "../middleware/auth";

export const getNotifications = async (req: AuthRequest, res: Response) => {
  const notifs = await Notification.find({ user: req.user?.id })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(notifs);
};

export const markRead = async (req: AuthRequest, res: Response) => {
  await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user?.id },
    { read: true }
  );
  res.json({ message: "Marked as read" });
};

export const markAllRead = async (req: AuthRequest, res: Response) => {
  await Notification.updateMany(
    { user: req.user?.id, read: false },
    { read: true }
  );
  res.json({ message: "All marked as read" });
};
