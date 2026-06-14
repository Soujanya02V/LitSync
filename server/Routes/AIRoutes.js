import express from "express";
import { extractTextFromPaper, generateMetadata } from "../controllers/AIController.js";

const router = express.Router();

// Route to extract text from a paper's PDF
// POST /api/ai/extract/:paperId
router.post("/extract/:paperId", extractTextFromPaper);

// Route to generate structured metadata from a paper's PDF using Gemini
// POST /api/ai/generate/:paperId
router.post("/generate/:paperId", generateMetadata);

export default router;
