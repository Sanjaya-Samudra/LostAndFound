import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  adminName: { type: String, required: true },
  targetType: { type: String, enum: ["user", "item"], required: true },
  targetId: { type: String },
  targetName: { type: String },
  details: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ActivityLog", activityLogSchema);
