import express from "express";
import multer from "multer";
import cloudinary from "../utils/cloudinary.js";
import Paper from "../models/Paper.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required (field: file)" });
    }

    const folderId = req.body?.folderId;
    if (!folderId) {
      return res.status(400).json({ message: "folderId is required" });
    }

    const title = req.file.originalname;

    const uploadResult = await new Promise((resolve, reject) => {
      const cloudinaryStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw", // PDFs and other non-image assets
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      cloudinaryStream.end(req.file.buffer);
    });

    const fileUrl = uploadResult?.secure_url;
    if (!fileUrl) {
      return res.status(500).json({ message: "Cloudinary upload failed (missing secure_url)" });
    }

    const paper = await Paper.create({
      title,
      fileUrl,
      folderId,
    });

    return res.status(201).json(paper);
  } catch (err) {
    return res.status(500).json({ message: err?.message || "Upload failed" });
  }
});

export default router;

