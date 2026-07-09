import { Request, Response } from "express";
import User from "../models/User";
import Item from "../models/Item";

export const getStats = async (req: Request, res: Response) => {
  const users = await User.countDocuments();
  const items = await Item.countDocuments();

  res.json({
    users,
    items,
  });
};

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find();

  res.json(users);
};

export const deleteUser = async (req: Request, res: Response) => {
  await User.findByIdAndDelete(req.params.id);

  res.json({
    message: "User Deleted",
  });
};

export const deleteItem = async (req: Request, res: Response) => {
  await Item.findByIdAndDelete(req.params.id);

  res.json({
    message: "Item Deleted",
  });
};