import { api } from "@/lib/axios";
import { CourseProgress } from "@/types/progress";

export const progressAPI = {
  getCourseProgress: async (courseId: string) => {
    const response = await api.get<CourseProgress>(`/api/progress/${courseId}`);
    return response.data;
  },
  updateLectureProgress: async (courseId: string, lectureId: string) => {
    const response = await api.post<CourseProgress>(
      `/api/progress/${courseId}/lecture/${lectureId}/view`
    );
    return response.data;
  },
  getAllPurchasedCourses: async () => {
    const response = await api.get("/api/purchase");
    return response.data;
  },
};
