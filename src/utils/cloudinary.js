import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new Error("File path not found");
    }

    const uploadedFile = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File uploaded to cloudinary: ", uploadedFile.url);
    return response;
  } catch (error) {
    return null;
  } finally {
    // Remove locally stored temp file
    fs.unlinkSync(localFilePath);
  }
};
