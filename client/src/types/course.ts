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
  lectures?: LectureType[];
  creator?: {
    username: string;
    avatar: string;
  };
  isPublished: boolean;
  updatedAt?: string;
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
  success?: boolean;
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

export interface CoursePurchaed {
  course: Course;
  success: boolean;
  purchased: boolean;
}

export interface SearchResultProps {
  course: {
    _id: string;
    title: string;
    subtitle: string;
    thumbnail: string;
    level: string;
    price: number;
    creator: {
      username: string;
      avatar: string;
    };
  };
}

export interface CoursePurchaseType {
  amount: number;
  courseId: Course[];
  paymentId: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  status: string;
}
