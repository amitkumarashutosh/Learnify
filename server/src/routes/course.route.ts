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
  removeLecture,
  editLecture,
  getLectureById,
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

router
  .route("/:courseId/lecture/:lectureId")
  .put(isAuthenticated, isAdmin, editLecture);
router
  .route("/:courseId/lecture/:lectureId")
  .delete(isAuthenticated, isAdmin, removeLecture);

router
  .route("/lecture/:lectureId")
  .get(isAuthenticated, isAdmin, getLectureById);

export default router;
