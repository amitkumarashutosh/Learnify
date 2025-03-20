import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import {
  deletePasskey,
  getUserPasskeys,
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
router.route("/get-passkeys").get(isAuthenticated, getUserPasskeys);
router.route("/delete").delete(isAuthenticated, deletePasskey);

export default router;
