import express, { Response } from "express";
import upload from "../utils/multer";
import { isAuthenticated, isAdmin, AuthRequest } from "../middlewares/auth";
import { uploadMedia } from "../utils/cloudinary";

const router = express.Router();

router.post(
  "/upload-video",
  isAuthenticated,
  isAdmin,
  upload.single("file"),
  async (req: AuthRequest, res: Response) => {
    try {
      const result = await uploadMedia(req.file);
      res.status(200).json({
        success: true,
        message: "File uploaded successfully.",
        data: result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error uploading file" });
    }
  }
);
export default router;
