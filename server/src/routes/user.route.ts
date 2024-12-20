import express from "express";
import { register, login, logout } from "../controllers/user.controller";

const router = express.Router();

router.post("/register", register);
router.route("/login").post(login);
router.route("/logout").get(logout);

export default router;
