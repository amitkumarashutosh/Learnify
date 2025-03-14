import express from "express";
import {
  register,
  login,
  logout,
  getUserProfile,
  updateUserProfile,
  getUserSecure,
  updateTwoFactorAuth,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/auth";
import upload from "../utils/multer";

const router = express.Router();

router.post("/register", register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile").get(isAuthenticated, getUserProfile);
router.route("/profile/get-secure").get(isAuthenticated, getUserSecure);
router
  .route("/profile/two-factor-auth")
  .put(isAuthenticated, updateTwoFactorAuth);
router
  .route("/profile/update")
  .put(isAuthenticated, upload.single("avatar"), updateUserProfile);

export default router;
