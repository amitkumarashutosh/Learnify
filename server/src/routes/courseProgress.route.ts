import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import {
  getCourseProgress,
  updateLectureProgress,
} from "../controllers/courseProgress.controller";

const router = express.Router();

router.route("/:courseId").get(isAuthenticated, getCourseProgress);
router
  .route("/:courseId/lecture/:lectureId/view")
  .post(isAuthenticated, updateLectureProgress);

export default router;
