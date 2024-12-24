export interface Course {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  category: string;
  level: string;
  price: number;
  thumbnail: string | File;
  enrolledStudents?: string[];
  lectures?: string[];
  creator: string;
  isPublished: boolean;
}

export interface CourseInput {
  title: string;
  category: string;
}

export interface CourseResponse {
  success?: boolean;
  message?: string;
  course?: Course;
}

export interface CreatorCoursesResponse {
  courses: Course[] | [];
}

export interface UpdateCourseResponse {
  message: string;
  course: Course;
}

export interface LectureType {
  _id: string;
  title: string;
  isPreview?: boolean;
  videoUrl?: string;
  publicId?: string;
}

export interface LectureResponse {
  lecture?: LectureType;
  success?: boolean;
}

export interface getLectureResponse {
  lectures: LectureType[];
}
