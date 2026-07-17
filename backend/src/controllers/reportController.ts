import { Response } from "express";
import Report from "../models/Report";
import Item from "../models/Item";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";
import { createLog } from "./activityLogController";

export const submitReport = async (req: AuthRequest, res: Response) => {
  const report = await Report.create({ ...req.body, reporter: req.user?.id });
  res.status(201).json(report);
};

export const getReports = async (req: AuthRequest, res: Response) => {
  const reports = await Report.find()
    .populate("reporter", "firstName lastName email")
    .sort({ createdAt: -1 });
  res.json(reports);
};

export const resolveReport = async (req: AuthRequest, res: Response) => {
  const report = await Report.findByIdAndUpdate(
    req.params.id,
    { status: "resolved" },
    { new: true }
  );
  if (!report) return res.status(404).json({ message: "Report not found" });

  await createLog(
    String(req.user.id),
    String(req.user.name || "Admin"),
    "resolve_report",
    "user",
    String(req.params.id),
    "Report"
  );

  res.json(report);
};

export const exportItemsCsv = async (req: AuthRequest, res: Response) => {
  const items = await Item.find().populate("postedBy", "firstName lastName email").lean();

  const header = "Title,Description,Category,Type,Status,Location,PostedBy,PostedEmail,CreatedAt\n";
  const rows = items.map((i: any) => {
    const name = i.postedBy ? `${i.postedBy.firstName || ""} ${i.postedBy.lastName || ""}`.trim() : "Unknown";
    const email = i.postedBy?.email || "";
    const date = i.createdAt ? new Date(i.createdAt).toISOString().split("T")[0] : "";
    return `"${i.title}","${(i.description || "").replace(/"/g, '""')}","${i.category}","${i.type}","${i.status}","${i.location || ""}","${name}","${email}","${date}"`;
  }).join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=items.csv");
  res.send(header + rows);
};

export const exportUsersCsv = async (req: AuthRequest, res: Response) => {
  const users = await User.find().select("-password").lean();

  const header = "FirstName,LastName,Email,Role,CreatedAt\n";
  const rows = users.map((u: any) => {
    const date = u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : "";
    return `"${u.firstName || ""}","${u.lastName || ""}","${u.email}","${u.role}","${date}"`;
  }).join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=users.csv");
  res.send(header + rows);
};
