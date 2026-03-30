import dotenv from "dotenv";
import { createRequire } from "module";

// Ensure environment variables are available (CLOUD_NAME, API_KEY, API_SECRET).
dotenv.config();

const require = createRequire(import.meta.url);
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export default cloudinary;
