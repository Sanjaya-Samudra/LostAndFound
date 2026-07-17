import express from "express";
import { getLogs } from "../controllers/activityLogController";
import auth from "../middleware/auth";
import admin from "../middleware/admin";

const router = express.Router();

router.get("/", auth, admin, getLogs);

export default router;
