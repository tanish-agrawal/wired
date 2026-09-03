import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (base64Image, folder = "wired_chats") => {
  if (!base64Image) return null;

  // Check if Cloudinary credentials are fully configured
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder,
        resource_type: "auto",
      });
      return uploadResponse.secure_url;
    } catch (error) {
      console.warn("Cloudinary upload failed, falling back to base64 payload:", error.message);
      return base64Image;
    }
  }

  // Fallback to base64 string if Cloudinary keys are not set
  return base64Image;
};

export default cloudinary;
