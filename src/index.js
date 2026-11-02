import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config();

await connectDB();
