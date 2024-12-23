import express from "express";
import {
  createCourse,
  editCourse,
  getCreatorCourse,
  getCourse,
} from "../controllers/course.controller";
import { isAuthenticated, isAdmin } from "../middlewares/auth";
import upload from "../utils/multer";

const router = express.Router();

router.route("/create").post(isAuthenticated, isAdmin, createCourse);
router.route("/").get(isAuthenticated, isAdmin, getCreatorCourse);
router
  .route("/:courseId")
  .put(isAuthenticated, isAdmin, upload.single("thumbnail"), editCourse);
router.route("/:courseId").get(isAuthenticated, isAdmin, getCourse);

export default router;
