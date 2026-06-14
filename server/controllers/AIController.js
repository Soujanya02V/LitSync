import Paper from "../models/Paper.js";
import axios from "axios";
import { PDFParse } from "pdf-parse";
import mongoose from "mongoose";

/**
 * Controller to extract text from a paper's PDF stored on Cloudinary.
 * POST /api/ai/extract/:paperId
 */
export const extractTextFromPaper = async (req, res) => {
  try {
    const { paperId } = req.params;

    // Validate paperId structure
    if (!mongoose.Types.ObjectId.isValid(paperId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid paper ID format"
      });
    }

    // Find paper by paperId
    const paper = await Paper.findById(paperId);
    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Paper not found"
      });
    }

    // Check if fileUrl is available
    if (!paper.fileUrl) {
      return res.status(400).json({
        success: false,
        message: "Paper has no associated file URL"
      });
    }

    // Download PDF from Cloudinary URL using axios
    console.log(`Downloading PDF from URL: ${paper.fileUrl}`);
    const response = await axios.get(paper.fileUrl, {
      responseType: "arraybuffer",
      headers: {
        "Accept": "application/pdf"
      }
    });

    // Convert response to Buffer
    const buffer = Buffer.from(response.data);

    // Extract text using PDFParse
    console.log("Extracting text from PDF buffer...");
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    const text = data.text || "";
    await parser.destroy();

    // Console logs show extracted text length
    console.log(`Successfully extracted text from paper ${paperId}. Extracted text length: ${text.length} characters.`);

    // Return response
    return res.status(200).json({
      success: true,
      textLength: text.length,
      preview: text.substring(0, 1000)
    });
  } catch (err) {
    console.error("Error in extractTextFromPaper controller:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to extract text from the PDF"
    });
  }
};
