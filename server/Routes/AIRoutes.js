import express from "express";
import { extractTextFromPaper } from "../controllers/AIController.js";

const router = express.Router();

// Route to extract text from a paper's PDF
// POST /api/ai/extract/:paperId
router.post("/extract/:paperId", extractTextFromPaper);

export default router;
