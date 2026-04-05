import mongoose from "mongoose";

const paperSchema = new mongoose.Schema({
  title: { type: String },
  fileUrl: { type: String },
  publicId: { type: String },
  resourceType: { type: String },
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
  authors: { type: String },
  year: { type: String },
  summary: { type: String },
  methodology: { type: String },
  advantages: { type: String },
  disadvantages: { type: String },
  limitations: { type: String },
  futureScope: { type: String },
  keywords: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Paper || mongoose.model("Paper", paperSchema);

