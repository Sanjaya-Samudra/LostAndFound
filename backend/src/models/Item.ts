import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },

  category: {
    type: String,
    enum: [
      "electronics",
      "accessories",
      "books",
      "clothing",
      "documents",
      "other",
    ],
  },

  type: {
    type: String,
    enum: ["lost", "found"],
  },

  status: {
    type: String,
    enum: ["open", "resolved", "archived"],
    default: "open",
  },

  images: [String],

  location: {
    type: String,
  },

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  expiresAt: { type: Date, default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Item", itemSchema);
