import { api, apiForm } from "@/lib/axios";
import {
  LoginInput,
  SignupInput,
  AuthResponse,
  ProfileUpdateInput,
  TwoFactResponse,
} from "@/types/auth";

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

  profile: async () => {
    const response = await api.get<AuthResponse>("/api/user/profile");
    return response.data;
  },

  updateProfile: async (userData: ProfileUpdateInput) => {
    if (userData.avatar) {
      const formData = new FormData();

      if (userData.username) formData.append("username", userData.username);
      if (userData.avatar) formData.append("avatar", userData.avatar);

      const response = await apiForm.put<AuthResponse>(
        "/api/user/profile/update",
        formData
      );
      return response.data;
    }

    const response = await api.put<AuthResponse>(
      "/api/user/profile/update",
      userData
    );
    return response.data;
  },

  updateTwoFactorAuth: async () => {
    const response = await api.put<TwoFactResponse>(
      "/api/user/profile/two-factor-auth"
    );
    return response.data;
  },

  getUserSecure: async () => {
    const response = await api.get<TwoFactResponse>(
      "/api/user/profile/get-secure"
    );
    return response.data;
  },
};
