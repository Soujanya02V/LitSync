import express from "express";
import Folder from "../models/Folder.js";

const router = express.Router();

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

export default router;
