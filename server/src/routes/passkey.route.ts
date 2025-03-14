import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import {
  loginWithPasskey,
  registerPasskey,
  verifyPasskey,
  verifyWithPasskey,
} from "../controllers/passkey.controller";

const router = express.Router();

router.route("/register").post(isAuthenticated, registerPasskey);
router.route("/verify").post(isAuthenticated, verifyPasskey);
router.route("/login-passkey").post(isAuthenticated, loginWithPasskey);
router.route("/verify-passkey").post(isAuthenticated, verifyWithPasskey);

export default router;
