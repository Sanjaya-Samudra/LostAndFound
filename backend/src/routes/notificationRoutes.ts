import express from "express";
import { getNotifications, markRead, markAllRead } from "../controllers/notificationController";
import auth from "../middleware/auth";

const router = express.Router();

router.get("/", auth, getNotifications);
router.put("/:id/read", auth, markRead);
router.put("/read-all", auth, markAllRead);

export default router;
