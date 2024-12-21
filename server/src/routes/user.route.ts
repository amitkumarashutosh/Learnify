import express from "express";
import {
  register,
  login,
  logout,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controller";
import isAuthenticated from "../middlewares/auth";
import upload from "../utils/multer";

const router = express.Router();

router.post("/register", register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile").get(isAuthenticated, getUserProfile);
router
  .route("/profile/update")
  .put(isAuthenticated, upload.single("avatar"), updateUserProfile);

export default router;
