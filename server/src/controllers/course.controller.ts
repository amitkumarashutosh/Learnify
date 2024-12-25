import { Request, Response } from "express";
import { Course } from "../models/course.model";
import { AuthRequest } from "../middlewares/auth";
import {
  deleteMediaFromCloudinary,
  deleteVideoFromCloudinary,
  uploadMedia,
} from "../utils/cloudinary";
import { Lecture } from "../models/lecture.model";

const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { title, category } = req.body;
    if (!title || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Title and category are required" });
    }

    const course = await Course.create({
      title,
      category,
      creator: req._id,
    });

    res.status(201).json({ course, success: true, message: "Course created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create course" });
  }
};

const getCreatorCourse = async (req: AuthRequest, res: Response) => {
  try {
    const courses = await Course.find({ creator: req._id });
    return res.status(200).json({
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create course",
    });
  }
};

const editCourse = async (req: AuthRequest, res: Response) => {
  try {
    const courseId = req.params.courseId;
    const { title, subtitle, description, category, level, price } = req.body;
    const thumbnail = req.file;

    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found!",
      });
    }

    let courseThumbnail = course.thumbnail;
    let cloudResponse = null;

    if (thumbnail) {
      if (course.thumbnail) {
        const publicId = course.thumbnail.split("/").pop()?.split(".")[0];
        if (publicId) {
          await deleteMediaFromCloudinary(publicId);
        }
      }

      cloudResponse = await uploadMedia(thumbnail);
      if (cloudResponse?.secure_url) {
        courseThumbnail = cloudResponse.secure_url;
      }
    }

    const updateData = {
      ...(title && { title }),
      ...(price && { price }),
      ...(level && { level }),
      ...(category && { category }),
      ...(description && { description }),
      ...(subtitle && { subtitle }),
      ...(cloudResponse?.secure_url && { thumbnail: courseThumbnail }),
    };

    // OR
    // const updateData = {};
    // if (title) updateData.title = title;
    // if (price) updateData.price = price;
    // if (level) updateData.level = level;
    // if (category) updateData.category = category;
    // if (description) updateData.description = description;
    // if (subtitle) updateData.subtitle = subtitle;
    // if (thumbnail) updateData.thumbnail = courseThumbnail;

    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    return res.status(200).json({
      course,
      message: "Course updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to update course",
    });
  }
};
const getCourse = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found!",
      });
    }
    return res.status(200).json({
      category: course.category,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      price: course.price,
      level: course.level,
      subtitle: course.subtitle,
      creator: course.creator,
      isPublished: course.isPublished,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get course",
    });
  }
};

const updateCourseStatus = async (req: AuthRequest, res: Response) => {
  try {
    const courseId = req.params.courseId;
    const { isPublished } = req.body;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found!",
      });
    }
    course.isPublished = isPublished;
    await course.save();
    return res.status(200).json({
      success: true,
      message: `${
        isPublished ? "Course published" : "Course unpublished"
      } successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to update course status" });
  }
};

const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found!",
      });
    }
    const publicId = course.thumbnail.split("/").pop()?.split(".")[0];
    if (publicId) {
      await deleteMediaFromCloudinary(publicId);
    }
    await Course.findByIdAndDelete(courseId);
    return res.status(200).json({
      success: true,
      message: "Course deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to delete course",
    });
  }
};

const createLecture = async (req: AuthRequest, res: Response) => {
  try {
    const { title } = req.body;
    const { courseId } = req.params;

    if (!title || !courseId) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const lecture = await Lecture.create({ title });

    const course = await Course.findById(courseId);
    if (course) {
      course.lectures.push(lecture._id);
      await course.save();
    }
    return res.status(200).json({
      lecture,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create lecture",
    });
  }
};

const getLectures = async (req: AuthRequest, res: Response) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        message: "Course not found!",
      });
    }
    return res.status(200).json({
      lectures: course.lectures,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get lectures",
    });
  }
};

const editLecture = async (req: AuthRequest, res: Response) => {
  try {
    const { title, videoUrl, publicId, isFree } = req.body;
    const { courseId, lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found!",
      });
    }

    if (title) lecture.title = title;
    if (videoUrl) lecture.videoUrl = videoUrl;
    if (publicId) lecture.publicId = publicId;
    if (isFree === true) lecture.isPreview = true;
    else lecture.isPreview = false;

    await lecture.save();

    return res.status(200).json({
      success: true,
      lecture,
      message: "Lecture updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to edit lecture",
    });
  }
};

const removeLecture = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, lectureId } = req.params;

    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found!",
      });
    }

    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }

    const course = await Course.findOneAndUpdate(
      { _id: courseId },
      { $pull: { lectures: lectureId } },
      { new: true }
    );

    //OR
    // const course = await Course.findOneAndUpdate(
    //   { lectures: lectureId },
    //   { $pull: { lectures: lectureId } },
    //   { new: true }
    // );

    res.status(200).json({
      success: true,
      message: "Lecture deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to remove lecture",
    });
  }
};

const getLectureById = async (req: AuthRequest, res: Response) => {
  try {
    const lectureId = req.params.lectureId;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
      });
    }
    return res.status(200).json({
      success: true,
      lecture,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get lecture",
    });
  }
};

export {
  createCourse,
  getCreatorCourse,
  getCourse,
  editCourse,
  updateCourseStatus,
  deleteCourse,
  createLecture,
  getLectures,
  editLecture,
  removeLecture,
  getLectureById,
};
