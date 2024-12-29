import { api } from "@/lib/axios";
import { Course, CoursePurchaed, CoursePurchaseType } from "@/types/course";

export const purchaseAPI = {
  createChechoutSession: async (courseId: string) => {
    const response = await api.post(
      `/api/purchase/checkout/create-checkout-session`,
      { courseId }
    );
    return response;
  },
  getCourseDetailWithPurchaseStatus: async (courseId: string) => {
    const response = await api.get<CoursePurchaed>(
      `/api/purchase/course/${courseId}/detail-with-status`
    );
    return response.data;
  },
  getAllPurchasedCourses: async () => {
    const response = await api.get<any>(`/api/purchase`);
    return response.data;
  },
};
