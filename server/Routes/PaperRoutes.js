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

async function handlePaperUpload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required (field: file)" });
    }

    const folderId = req.body?.folderId;
    if (!folderId) {
      return res.status(400).json({ message: "folderId is required" });
    }

    const createdBy = optionalTrimmedString(req.body?.createdBy);
    if (!createdBy) {
      return res.status(400).json({ message: "createdBy is required" });
    }

    const title = req.file.originalname;
    const authors = optionalTrimmedString(req.body?.authors);
    const year = optionalTrimmedString(req.body?.year);
    const summary = optionalTrimmedString(req.body?.summary);
    const methodology = optionalTrimmedString(req.body?.methodology);
    const advantages = optionalTrimmedString(req.body?.advantages);
    const disadvantages = optionalTrimmedString(req.body?.disadvantages);
    const limitations = optionalTrimmedString(req.body?.limitations);
    const futureScope = optionalTrimmedString(req.body?.futureScope);
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
      createdBy,
      authors,
      year,
      summary,
      methodology,
      advantages,
      disadvantages,
      limitations,
      futureScope,
      keywords,
    });

    return res.status(201).json(paper);
  } catch (err) {
    return res.status(500).json({ message: err?.message || "Upload failed" });
  }
}

router.post("/upload", upload.single("file"), handlePaperUpload);
router.post("/", upload.single("file"), handlePaperUpload);

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid paper id" });
    }

    const update = {};
    if (req.body.authors !== undefined) update.authors = optionalTrimmedString(req.body.authors);
    if (req.body.year !== undefined) update.year = optionalTrimmedString(req.body.year);
    if (req.body.summary !== undefined) update.summary = optionalTrimmedString(req.body.summary);
    if (req.body.methodology !== undefined) update.methodology = optionalTrimmedString(req.body.methodology);
    if (req.body.advantages !== undefined) update.advantages = optionalTrimmedString(req.body.advantages);
    if (req.body.disadvantages !== undefined) update.disadvantages = optionalTrimmedString(req.body.disadvantages);
    if (req.body.limitations !== undefined) update.limitations = optionalTrimmedString(req.body.limitations);
    if (req.body.futureScope !== undefined) update.futureScope = optionalTrimmedString(req.body.futureScope);
    if (req.body.keywords !== undefined) update.keywords = parseKeywords(req.body.keywords);


    const paper = await Paper.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    return res.json(paper);
  } catch (err) {
    return res.status(500).json({ message: err?.message || "Failed to update paper" });
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

    const createdBy = optionalTrimmedString(req.query?.createdBy);
    if (!createdBy) {
      return res.status(400).json({ message: "createdBy query parameter is required" });
    }

    const papers = await Paper.find({ folderId, createdBy }).sort({ createdAt: -1 });
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

