import { Request, Response } from "express";
import { IUser, User } from "../models/user.model";
import { AuthRequest } from "../middlewares/auth";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary";
import { resend, generateOTP, generateOtpEmailTemplate } from "../utils/resend";
import { IOTP, OTP } from "../models/otp.model";

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
      secure: user.secure,
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
    const user = await User.findById(userId)
      .select("-password")
      .populate("enrolledCourses");

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
    const { username, secure } = req.body;
    const avatar = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (secure) user.secure = true;
    else user.secure = false;

    await user.save();

    let cloudResponse = null;
    if (avatar) {
      if (user.avatar) {
        const publicId = user.avatar.split("/").pop()?.split(".")[0];
        if (publicId) await deleteMediaFromCloudinary(publicId);
      }
      cloudResponse = await uploadMedia(avatar);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(username && { username }),
        ...(cloudResponse?.secure_url && { avatar: cloudResponse.secure_url }),
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
        secure: updatedUser?.secure,
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

const updateTwoFactorAuth = async (req: AuthRequest, res: Response) => {
  const userId = req._id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  user.secure = !user.secure;
  await user.save();

  return res.status(200).json({
    success: true,
    secure: user.secure,
  });
};

const getUserSecure = async (req: AuthRequest, res: Response) => {
  const userId = req._id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  return res.status(200).json({
    success: true,
    secure: user.secure,
  });
};

const sendOTP = async (req: Request, res: Response) => {
  const { email } = req.body;
  const otp = generateOTP();

  try {
    const user: IUser | null = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        message: "Email does not exist! Please register",
        success: false,
      });

    const code: IOTP = await OTP.create({ email, otp });
    if (!code)
      return res
        .status(500)
        .json({ message: "Error while creating OTP", success: false });

    const resendResponse = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "🔐 Your Secure OTP Code",
      html: generateOtpEmailTemplate(otp),
    });

    if (!resendResponse.data) {
      return res.json({
        message: resendResponse.error?.message,
        success: false,
      });
    }

    res.json({ message: "OTP sent successfully!", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error sending OTP", success: false });
  }
};

const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res
      .status(400)
      .json({ message: "Email or OTP is required", success: false });

  try {
    const user: IUser | null = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        message: "Email does not exist! Please register",
        success: false,
      });

    const otpRecord: IOTP | null = await OTP.findOne({ email, otp });
    if (!otpRecord)
      return res
        .status(400)
        .json({ message: "OTP expired or invalid!", success: false });

    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({ message: "OTP verified successfully!", success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error verifying OTP", success: false });
  }
};

export {
  register,
  login,
  logout,
  getUserProfile,
  updateUserProfile,
  updateTwoFactorAuth,
  getUserSecure,
  sendOTP,
  verifyOTP,
};
