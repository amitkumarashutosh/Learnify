import express from "express";
import {
  createCourse,
  editCourse,
  getCreatorCourse,
  getCourse,
  updateCourseStatus,
  deleteCourse,
  createLecture,
  getLectures,
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
router
  .route("/status/:courseId")
  .patch(isAuthenticated, isAdmin, updateCourseStatus);
router.route("/:courseId").delete(isAuthenticated, isAdmin, deleteCourse);

router
  .route("/:courseId/lecture")
  .post(isAuthenticated, isAdmin, createLecture);
router.route("/:courseId/lecture").get(isAuthenticated, isAdmin, getLectures);
export default router;
