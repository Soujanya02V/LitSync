import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const paperSchema = new mongoose.Schema({
  title: String,
  folderId: mongoose.Schema.Types.ObjectId,
  createdBy: String,
}, { strict: false });

const Paper = mongoose.model('Paper', paperSchema);

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    const papers = await Paper.find({ folderId: "6a057b9fc9a67206e56ac403" });
    console.log("PAPERS_COUNT:", papers.length);
    console.log(JSON.stringify(papers, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}
run();
