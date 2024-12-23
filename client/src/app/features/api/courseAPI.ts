import { api, apiForm } from "@/lib/axios";
import {
  Course,
  CourseInput,
  CourseResponse,
  CreatorCoursesResponse,
  UpdateCourseResponse,
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
  updateCourse: async (courseId: string, courseData: FormData) => {
    const response = await apiForm.put<UpdateCourseResponse>(
      `/api/course/${courseId}`,
      courseData
    );
    return response.data;
  },
  updateCourseStatus: async (courseId: string, status: boolean) => {
    const response = await api.patch<CourseResponse>(
      `/api/course/status/${courseId}`,
      { isPublished: status }
    );
    return response.data;
  },

  deleteCourse: async (courseId: string) => {
    const response = await api.delete<CourseResponse>(
      `/api/course/${courseId}`
    );
    return response.data;
  },
};
