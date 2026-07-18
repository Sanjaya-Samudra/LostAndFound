import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  targetType: { type: String, enum: ["item", "user"], required: true },
  targetId: { type: String, required: true },
  reason: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["open", "resolved"], default: "open" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Report", reportSchema);
