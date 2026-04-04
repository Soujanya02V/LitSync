import express from "express";
import mongoose from "mongoose";
import Folder from "../models/Folder.js";
import Paper from "../models/Paper.js";
import cloudinary from "../utils/cloudinary.js";

const router = express.Router();

function extractPublicIdFromRawUrl(url) {
  if (!url) return "";
  const match = url.match(/\/raw\/upload\/(?:v\d+\/)?(.+)$/);
  if (!match?.[1]) return "";
  return match[1].replace(/\.[^/.]+$/, "");
}

async function destroyPaperAsset(paper) {
  const publicId = paper.publicId || extractPublicIdFromRawUrl(paper.fileUrl);
  if (!publicId) return;

  const destroyResult = await cloudinary.uploader.destroy(publicId, {
    resource_type: paper.resourceType || "raw",
    invalidate: true,
  });

  if (destroyResult?.result && destroyResult.result !== "ok" && destroyResult.result !== "not found") {
    throw new Error(`Cloudinary delete failed: ${destroyResult.result}`);
  }
}

router.post("/", async (req, res) => {
  try {
    const folder = await Folder.create(req.body);
    res.status(201).json(folder);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const folders = await Folder.find();
    res.json(folders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:folderId", async (req, res) => {
  try {
    const { folderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return res.status(400).json({ message: "Invalid folderId" });
    }

    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const papers = await Paper.find({ folderId });
    for (const paper of papers) {
      await destroyPaperAsset(paper);
    }

    await Paper.deleteMany({ folderId });
    await Folder.findByIdAndDelete(folderId);

    return res.json({ message: "Folder deleted", folderId });
  } catch (err) {
    return res.status(500).json({ message: err?.message || "Failed to delete folder" });
  }
});

export default router;
