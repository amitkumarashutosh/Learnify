import { Request, Response } from "express";
import { User } from "../models/user.model";
import { AuthRequest } from "../middlewares/auth";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary";

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

    const userResponse = {
      username: user.username,
      email: user.email,
      _id: user._id,
      role: user.role,
      enrolledCourses: user.enrolledCourses,
      avatar: user.avatar,
    };

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, //hour min second milisecond = 1 day
        sameSite: "strict",
      })
      .json({
        message: "Login successfully",
        success: true,
        user: userResponse,
      });
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

const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req._id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,

      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get user profile",
    });
  }
};

const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req._id;
    const { username } = req.body;
    const avatar = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.avatar) {
      const publicId = user.avatar.split("/").pop()?.split(".")[0];
      if (publicId) await deleteMediaFromCloudinary(publicId);
    }

    const cloudResponse = avatar?.path ? await uploadMedia(avatar.path) : null;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        avatar: cloudResponse?.secure_url,
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: {
        username: updatedUser?.username,
        email: updatedUser?.email,
        avatar: updatedUser?.avatar,
        role: updatedUser?.role,
        enrolledCourses: updatedUser?.enrolledCourses,
        _id: updatedUser?._id,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user profile",
    });
  }
};

export { register, login, logout, getUserProfile, updateUserProfile };
