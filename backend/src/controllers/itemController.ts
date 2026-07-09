import { Request, Response } from "express";
import Item from "../models/Item";

export const getItems = async (req: Request, res: Response) => {
  const items = await Item.find().populate("postedBy", "firstName lastName");
  res.json(items);
};

export const getItemById = async (req: Request, res: Response) => {
  const item = await Item.findById(req.params.id).populate("postedBy");
  res.json(item);
};

export const createItem = async (req: Request, res: Response) => {
  const item = await Item.create(req.body);
  res.status(201).json(item);
};

export const updateItem = async (req: Request, res: Response) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json(item);
};

export const deleteItem = async (req: Request, res: Response) => {
  await Item.findByIdAndDelete(req.params.id);

  res.json({
    message: "Item Deleted",
  });
};