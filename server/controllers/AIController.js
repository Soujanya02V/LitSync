import Paper from "../models/Paper.js";
import axios from "axios";
import { PDFParse } from "pdf-parse";
import mongoose from "mongoose";
import Groq from "groq-sdk";

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

/**
 * Controller to generate structured metadata from a paper's PDF using Gemini.
 * POST /api/ai/generate/:paperId
 */
export const generateMetadata = async (req, res) => {
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
    console.log(`Downloading PDF for metadata generation from URL: ${paper.fileUrl}`);
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

    const truncatedText = text.substring(0, 20000);
    console.log("Original Length:", text.length);
    console.log("Sent To Groq:", truncatedText.length);

    // Initialize Groq SDK
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "GROQ_API_KEY is not defined in environment variables"
      });
    }

    const groq = new Groq({ apiKey });

    const prompt = `
Analyze this research paper.

Return ONLY valid JSON matching this schema:
{
  "title": "",
  "authors": "",
  "year": "",
  "keywords": [],
  "summary": "",
  "methodology": "",
  "advantages": "",
  "disadvantages": "",
  "limitations": "",
  "futureScope": ""
}

If any field (such as title, authors, year, keywords, summary, methodology, advantages, disadvantages, limitations, futureScope) cannot be confidently determined from the text, return an empty string (or an empty array for keywords). Do not hallucinate or invent information.

Research Paper Text:
${truncatedText}
`;

    console.log("Sending prompt to Groq...");
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" },
    });

    let responseText = chatCompletion.choices[0]?.message?.content || "";
    responseText = responseText.trim();

    // Sanitize responseText to ensure it's clean JSON (strip markdown code block if present)
    if (responseText.startsWith("```")) {
      responseText = responseText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    }

    const parsedJson = JSON.parse(responseText);

    console.log("Groq successfully generated metadata.");

    // Update the Paper document in MongoDB
    let authorsStr = "";
    if (parsedJson.authors) {
      if (Array.isArray(parsedJson.authors)) {
        authorsStr = parsedJson.authors.map(String).map(s => s.trim()).filter(Boolean).join(", ");
      } else if (typeof parsedJson.authors === "string") {
        authorsStr = parsedJson.authors.trim();
      } else {
        authorsStr = String(parsedJson.authors).trim();
      }
    }

    const updatePayload = {
      authors: authorsStr,
      year: parsedJson.year || "",
      keywords: Array.isArray(parsedJson.keywords) ? parsedJson.keywords : [],
      summary: parsedJson.summary || "",
      methodology: parsedJson.methodology || "",
      advantages: parsedJson.advantages || "",
      disadvantages: parsedJson.disadvantages || "",
      limitations: parsedJson.limitations || "",
      futureScope: parsedJson.futureScope || ""
    };

    // Keep original title if AI fails to confidently extract a new title
    if (parsedJson.title && parsedJson.title.trim() !== "") {
      updatePayload.title = parsedJson.title.trim();
    }

    const updatedPaper = await Paper.findByIdAndUpdate(
      paperId,
      updatePayload,
      { new: true, runValidators: true }
    );

    if (!updatedPaper) {
      return res.status(404).json({
        success: false,
        message: "Paper not found during update"
      });
    }

    console.log("Metadata generated and saved successfully into MongoDB.");

    return res.status(200).json({
      success: true,
      message: "Metadata generated and saved successfully",
      metadata: updatedPaper
    });
  } catch (err) {
    console.error("Error in generateMetadata controller:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to generate metadata using AI"
    });
  }
};

