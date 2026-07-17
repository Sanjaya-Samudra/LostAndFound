import express from "express";
import { submitReport, getReports, resolveReport } from "../controllers/reportController";
import { exportItemsCsv, exportUsersCsv } from "../controllers/reportController";
import auth from "../middleware/auth";
import admin from "../middleware/admin";

const router = express.Router();

router.post("/", auth, submitReport);
router.get("/", auth, admin, getReports);
router.put("/:id/resolve", auth, admin, resolveReport);

router.get("/items/csv", auth, admin, exportItemsCsv);
router.get("/users/csv", auth, admin, exportUsersCsv);

export default router;
