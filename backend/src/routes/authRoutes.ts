import express from "express";
import {
  register,
  login,
  profile,
  updateProfile,
  changePassword,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";
import auth from "../middleware/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/profile", auth, profile);
router.put("/profile", auth, updateProfile);
router.put("/password", auth, changePassword);

export default router;
