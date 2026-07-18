import express from "express";
import { Request, Response } from "express";
import upload from "../middleware/upload";
import auth from "../middleware/auth";
import cloudinary from "../config/cloudinary";

const router = express.Router();

router.post("/image", auth, upload.single("image"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "lostandfound" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file!.buffer);
    });

    res.json({ url: result.secure_url });
  } catch {
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;
