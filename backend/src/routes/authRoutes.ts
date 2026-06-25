import express from "express";
import { register, login, verifyEmail } from "../controllers/authController";

const router = express.Router();

// Public Authentication Endpoints
router.post("/register", register);
router.post("/login", login);
router.get("/verify-email/:token", verifyEmail);

export default router;
