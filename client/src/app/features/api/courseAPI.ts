import { api, apiForm } from "@/lib/axios";
import {
  Course,
  CourseInput,
  CourseResponse,
  CreatorCoursesResponse,
} from "@/types/course";

export const courseAPI = {
  createCourse: async (courseData: CourseInput) => {
    const response = await api.post<CourseResponse>(
      "/api/course/create",
      courseData
    );
    return response.data;
  },
  getCreatorCourse: async () => {
    const response = await api.get<CreatorCoursesResponse>("/api/course");
    return response.data;
  },
  getCourse: async (courseId: string) => {
    const response = await api.get<Partial<Course>>(`/api/course/${courseId}`);
    return response.data;
  },
  // updateCourse: async (courseId: string, courseData: CourseInput) => {
  //   const response = await apiForm.put<CourseResponse>(
  //     `/api/course/${courseId}`,
  //     courseData
  //   );
  //   return response.
  // }
};
