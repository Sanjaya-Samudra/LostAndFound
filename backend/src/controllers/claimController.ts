import { Response } from "express";
import Claim from "../models/Claim";
import Item from "../models/Item";
import Notification from "../models/Notification";
import { AuthRequest } from "../middleware/auth";

export const createClaim = async (req: AuthRequest, res: Response) => {
  const { itemId, description, proofDetails } = req.body;
  const item = await Item.findById(itemId);
  if (!item) return res.status(404).json({ message: "Item not found" });
  if (item.status !== "open") return res.status(400).json({ message: "Item is not available for claims" });

  const existing = await Claim.findOne({ item: itemId, claimant: req.user?.id, status: "pending" });
  if (existing) return res.status(400).json({ message: "You already have a pending claim on this item" });

  const claim = await Claim.create({
    item: itemId,
    claimant: req.user?.id,
    description,
    proofDetails,
  });

  if (item.postedBy) {
    await Notification.create({
      user: item.postedBy,
      type: "info",
      message: `Someone has submitted a claim on your item "${item.title}".`,
      itemId: item._id,
    });
  }

  const populated = await Claim.findById(claim._id).populate("claimant", "firstName lastName email");
  res.status(201).json(populated);
};

export const getMyClaims = async (req: AuthRequest, res: Response) => {
  const claims = await Claim.find({ claimant: req.user?.id })
    .populate("item", "title images type")
    .populate("claimant", "firstName lastName")
    .sort({ createdAt: -1 });
  res.json(claims);
};

export const getItemClaims = async (req: AuthRequest, res: Response) => {
  const item = await Item.findById(req.params.itemId);
  if (!item) return res.status(404).json({ message: "Item not found" });
  if (item.postedBy?.toString() !== req.user?.id && req.user?.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
  }
  const claims = await Claim.find({ item: req.params.itemId })
    .populate("claimant", "firstName lastName email")
    .sort({ createdAt: -1 });
  res.json(claims);
};

export const updateClaimStatus = async (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  const claim = await Claim.findById(req.params.id).populate("item", "title postedBy");
  if (!claim) return res.status(404).json({ message: "Claim not found" });

  const item = claim.item as any;
  if (item.postedBy?.toString() !== req.user?.id && req.user?.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
  }

  claim.status = status;
  await claim.save();

  if (status === "approved") {
    await Item.findByIdAndUpdate(item._id, { status: "resolved" });
    await Notification.create({
      user: claim.claimant,
      type: "resolved",
      message: `Your claim on "${item.title}" has been approved!`,
      itemId: item._id,
    });
  } else if (status === "rejected") {
    await Notification.create({
      user: claim.claimant,
      type: "info",
      message: `Your claim on "${item.title}" has been rejected.`,
      itemId: item._id,
    });
  }

  res.json(claim);
};

export const getAllClaims = async (req: AuthRequest, res: Response) => {
  const claims = await Claim.find()
    .populate("item", "title images type status")
    .populate("claimant", "firstName lastName email")
    .sort({ createdAt: -1 });
  res.json(claims);
};
