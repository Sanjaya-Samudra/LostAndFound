import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },
  suspended: { type: Boolean, default: false },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
