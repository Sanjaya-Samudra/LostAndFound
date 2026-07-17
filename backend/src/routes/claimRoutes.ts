import express from "express";
import {
  createClaim,
  getMyClaims,
  getItemClaims,
  updateClaimStatus,
  getAllClaims,
} from "../controllers/claimController";
import auth from "../middleware/auth";
import admin from "../middleware/admin";

const router = express.Router();

router.get("/my", auth, getMyClaims);
router.get("/all", auth, admin, getAllClaims);
router.get("/item/:itemId", auth, getItemClaims);
router.post("/", auth, createClaim);
router.put("/:id", auth, updateClaimStatus);

export default router;
