import express from "express";
import multer from "multer";
import cloudinary from "../utils/cloudinary.js";
import Paper from "../models/Paper.js";
import mongoose from "mongoose";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

function addFlAttachmentFalse(url) {
  if (!url) return url;
  return url.includes("?") ? `${url}&fl_attachment=false` : `${url}?fl_attachment=false`;
}

function optionalTrimmedString(value) {
  if (value == null) return undefined;
  const s = String(value).trim();
  return s === "" ? undefined : s;
}

function parseKeywords(raw) {
  if (raw == null || raw === "") return [];
  if (Array.isArray(raw)) {
    return raw.map((k) => String(k).trim()).filter(Boolean);
  }
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((k) => String(k).trim()).filter(Boolean);
        }
      } catch {
        // treat as plain text / comma-separated
      }
    }
    return trimmed.split(",").map((k) => k.trim()).filter(Boolean);
  }
  return [];
}

async function uploadRawBufferToCloudinary(buffer, originalFilename) {
  return await new Promise((resolve, reject) => {
    const cloudinaryStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        access_mode: "public",
        filename_override: originalFilename,
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    cloudinaryStream.end(buffer);
  });
}

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
    const authors = optionalTrimmedString(req.body?.authors);
    const year = optionalTrimmedString(req.body?.year);
    const summary = optionalTrimmedString(req.body?.summary);
    const keywords = parseKeywords(req.body?.keywords);

    const uploadResult = await uploadRawBufferToCloudinary(req.file.buffer, req.file.originalname);

    const publicId = uploadResult?.public_id;
    const resourceType = uploadResult?.resource_type || "raw";
    const secureUrl = uploadResult?.secure_url;

    if (!publicId || !secureUrl) {
      return res.status(500).json({ message: "Cloudinary upload failed (missing secure_url/public_id)" });
    }

    const fileUrl = addFlAttachmentFalse(secureUrl);

    const paper = await Paper.create({
      title,
      fileUrl,
      publicId,
      resourceType,
      folderId,
      authors,
      year,
      summary,
      keywords,
    });

    return res.status(201).json(paper);
  } catch (err) {
    return res.status(500).json({ message: err?.message || "Upload failed" });
  }
});

function extractPublicIdFromRawUrl(url) {
  if (!url) return "";
  // Expected patterns like:
  // https://res.cloudinary.com/<cloud>/raw/upload/v123/my/folder/file.pdf
  // https://res.cloudinary.com/<cloud>/raw/upload/my/folder/file.pdf
  const match = url.match(/\/raw\/upload\/(?:v\d+\/)?(.+)$/);
  if (!match?.[1]) return "";
  return match[1].replace(/\.[^/.]+$/, "");
}

router.get("/:folderId", async (req, res) => {
  try {
    const { folderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return res.status(400).json({ message: "Invalid folderId" });
    }

    const papers = await Paper.find({ folderId }).sort({ createdAt: -1 });
    return res.json(papers);
  } catch (err) {
    return res.status(500).json({ message: err?.message || "Failed to fetch papers" });
  }
});

router.delete("/:paperId", async (req, res) => {
  try {
    const { paperId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(paperId)) {
      return res.status(400).json({ message: "Invalid paperId" });
    }

    const paper = await Paper.findById(paperId);
    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    const publicId = paper.publicId || extractPublicIdFromRawUrl(paper.fileUrl);
    if (!publicId) {
      return res.status(500).json({ message: "Missing publicId for Cloudinary delete" });
    }

    const destroyResult = await cloudinary.uploader.destroy(publicId, {
      resource_type: paper.resourceType || "raw",
      invalidate: true,
    });

    // Cloudinary can return { result: "not found" } if already removed; still delete from DB.
    if (destroyResult?.result && destroyResult.result !== "ok" && destroyResult.result !== "not found") {
      return res.status(500).json({ message: `Cloudinary delete failed: ${destroyResult.result}` });
    }

    const deleted = await Paper.findByIdAndDelete(paperId);
    return res.json(deleted);
  } catch (err) {
    return res.status(500).json({ message: err?.message || "Failed to delete paper" });
  }
});

export default router;

