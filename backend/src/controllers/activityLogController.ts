import { Response } from "express";
import ActivityLog from "../models/ActivityLog";
import { AuthRequest } from "../middleware/auth";

export const createLog = async (
  adminId: string,
  adminName: string,
  action: string,
  targetType: "user" | "item",
  targetId?: string,
  targetName?: string,
  details?: string
) => {
  await ActivityLog.create({ adminId, adminName, action, targetType, targetId, targetName, details });
};

export const getLogs = async (req: AuthRequest, res: Response) => {
  const { limit } = req.query;
  const logs = await ActivityLog.find()
    .sort({ createdAt: -1 })
    .limit(parseInt(limit as string) || 100);
  res.json(logs);
};
