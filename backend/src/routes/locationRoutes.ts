import express from "express";
import { getLocations, createLocation, deleteLocation } from "../controllers/locationController";
import auth from "../middleware/auth";
import admin from "../middleware/admin";

const router = express.Router();

router.get("/", getLocations);
router.post("/", auth, admin, createLocation);
router.delete("/:id", auth, admin, deleteLocation);

export default router;
