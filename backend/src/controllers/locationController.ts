import { Response } from "express";
import Location from "../models/Location";
import { AuthRequest } from "../middleware/auth";

export const getLocations = async (req: AuthRequest, res: Response) => {
  const locations = await Location.find().sort({ name: 1 });
  res.json(locations);
};

export const createLocation = async (req: AuthRequest, res: Response) => {
  const existing = await Location.findOne({ name: req.body.name });
  if (existing) return res.status(400).json({ message: "Location already exists" });
  const location = await Location.create({ name: req.body.name });
  res.status(201).json(location);
};

export const deleteLocation = async (req: AuthRequest, res: Response) => {
  await Location.findByIdAndDelete(req.params.id);
  res.json({ message: "Location deleted" });
};
