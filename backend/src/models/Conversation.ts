import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
  lastMessage: { type: String },
  lastMessageAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Conversation", conversationSchema);
