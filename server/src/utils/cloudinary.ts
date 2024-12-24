import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({});

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

export const uploadMedia = async (file: Express.Multer.File | undefined) => {
  try {
    if (!file || !file.buffer) {
      throw new Error("No file provided");
    }

    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
    });
    return uploadResponse;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteMediaFromCloudinary = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteVideoFromCloudinary = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
