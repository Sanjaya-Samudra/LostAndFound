import { Response } from "express";
import Conversation from "../models/Conversation";
import Message from "../models/Message";
import { AuthRequest } from "../middleware/auth";

export const startConversation = async (req: AuthRequest, res: Response) => {
  const { recipientId, itemId, text } = req.body;
  if (recipientId === req.user?.id) return res.status(400).json({ message: "Cannot message yourself" });

  let conversation = await Conversation.findOne({
    participants: { $all: [String(req.user?.id), recipientId] },
    item: itemId || { $exists: false },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [String(req.user?.id), recipientId],
      item: itemId,
    });
  }

  const message = await Message.create({
    conversation: String(conversation._id),
    sender: String(req.user?.id),
    text,
  });

  conversation.lastMessage = text;
  conversation.lastMessageAt = new Date();
  await conversation.save();

  const populated = await Message.findById(message._id).populate("sender", "firstName lastName");
  res.status(201).json(populated);
};

export const getConversations = async (req: AuthRequest, res: Response) => {
  const conversations = await Conversation.find({
    participants: req.user?.id,
  })
    .populate("participants", "firstName lastName email")
    .populate("item", "title images")
    .sort({ lastMessageAt: -1 });
  res.json(conversations);
};

export const getMessages = async (req: AuthRequest, res: Response) => {
  const conversation = await Conversation.findById(req.params.conversationId);
  if (!conversation) return res.status(404).json({ message: "Conversation not found" });

  const isParticipant = conversation.participants.some((p: any) => p.toString() === req.user?.id);
  if (!isParticipant) return res.status(403).json({ message: "Not a participant" });

  const messages = await Message.find({ conversation: req.params.conversationId })
    .populate("sender", "firstName lastName")
    .sort({ createdAt: 1 });

  await Message.updateMany(
    { conversation: req.params.conversationId, sender: { $ne: req.user?.id }, read: false },
    { read: true }
  );

  res.json(messages);
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  const conversation = await Conversation.findById(req.params.conversationId);
  if (!conversation) return res.status(404).json({ message: "Conversation not found" });

  const isParticipant = conversation.participants.some((p: any) => p.toString() === req.user?.id);
  if (!isParticipant) return res.status(403).json({ message: "Not a participant" });

  const message = await Message.create({
    conversation: String(req.params.conversationId),
    sender: String(req.user?.id),
    text: req.body.text,
  });

  conversation.lastMessage = req.body.text;
  conversation.lastMessageAt = new Date();
  await conversation.save();

  const populated = await Message.findById(message._id).populate("sender", "firstName lastName");
  res.status(201).json(populated);
};

export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  const conversations = await Conversation.find({ participants: req.user?.id });
  const ids = conversations.map((c) => c._id);
  const count = await Message.countDocuments({
    conversation: { $in: ids },
    sender: { $ne: req.user?.id },
    read: false,
  });
  res.json({ count });
};
