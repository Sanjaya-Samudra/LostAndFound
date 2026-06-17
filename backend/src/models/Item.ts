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
    enum: ["open", "resolved"],
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

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

itemSchema.index({
  title: "text",
  description: "text",
});

export default mongoose.model("Item", itemSchema);