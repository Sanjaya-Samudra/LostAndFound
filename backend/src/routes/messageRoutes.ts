import express from "express";
import {
  startConversation,
  getConversations,
  getMessages,
  sendMessage,
  getUnreadCount,
} from "../controllers/messageController";
import auth from "../middleware/auth";

const router = express.Router();

router.get("/conversations", auth, getConversations);
router.get("/conversations/:conversationId", auth, getMessages);
router.get("/unread", auth, getUnreadCount);
router.post("/conversations", auth, startConversation);
router.post("/conversations/:conversationId", auth, sendMessage);

export default router;
