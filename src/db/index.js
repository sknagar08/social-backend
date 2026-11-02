import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export default async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n MONGODB CONNECTED!! HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MONGODB CONNECTION FAILED: ", error);
    process.exit(1);
  }
}
