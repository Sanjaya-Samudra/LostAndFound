import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  next();
};

export default admin;