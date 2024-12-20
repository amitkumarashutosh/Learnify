import { Request, Response } from "express";
import { User } from "../models/user.model";

const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({
        success: false,
        message: "User already exist with this email",
      });
    }

    const user = await User.create({ username, email, password });
    return res
      .status(201)
      .json({ success: true, message: "Account created successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to register" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect email or password" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect email or password" });
    }

    const token = await user.generateToken();

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, //hour min second milisecond = 1 day
        sameSite: "strict",
      })
      .json({ message: "Login successfully", success: true, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Failed to login" });
  }
};

const logout = async (req: Request, res: Response) => {
  res
    .status(200)
    .clearCookie("token", {
      httpOnly: true,
      maxAge: 0,
      sameSite: "strict",
    })
    .json({ message: "Logout successfully", success: true });
};

export { register, login, logout };
