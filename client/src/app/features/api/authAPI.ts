import { api } from "@/lib/axios";
import { LoginInput, SignupInput, AuthResponse } from "@/types/auth";

export const authAPI = {
  login: async (credentials: LoginInput) => {
    const response = await api.post<AuthResponse>(
      "/api/user/login",
      credentials
    );
    return response.data;
  },

  signup: async (userData: SignupInput) => {
    const response = await api.post<AuthResponse>(
      "/api/user/register",
      userData
    );
    return response.data;
  },

  logout: async () => {
    const response = await api.get<AuthResponse>("/api/user/logout");
    return response.data;
  },
};
