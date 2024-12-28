import { Course } from "./course";

export interface CourseProgress {
  courseDetails: Course;
  success: boolean;
  progress: LectureProgress[];
  completed: boolean;
}

export interface LectureProgress {
  lectureId: string;
  viewed: boolean;
}
