import mongoose from "mongoose";

const paperSchema = new mongoose.Schema({
  title: { type: String },
  fileUrl: { type: String },
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Paper || mongoose.model("Paper", paperSchema);

