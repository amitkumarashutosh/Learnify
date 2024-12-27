import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";

export interface AuthRequest extends Request {
  _id?: string;
  file?: Express.Multer.File;
}

export const isAuthenticated = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    req._id = decode.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Authentication failed",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

export const isAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req._id);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    if (user.role !== "instructor") {
      return res.status(403).json({
        message: "Access denied. Instructor role required.",
        success: false,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while checking authentication.",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};
