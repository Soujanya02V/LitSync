import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import folderRoutes from "./Routes/folderRoutes.js";
import paperRoutes from "./Routes/PaperRoutes.js";
import aiRoutes from "./Routes/AIRoutes.js";
dotenv.config();
// console.log("Cloudinary ready:", cloudinary.config().cloud_name);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error("DB connection error:", err.message));

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/folders", folderRoutes);
app.use("/papers", paperRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});