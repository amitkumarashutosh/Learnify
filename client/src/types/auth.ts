export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput extends LoginInput {
  username: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: "instructor" | "student";
  enrolledCourses?: string[];
  avatar: string;
  secure: boolean;
  passkeys?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthResponse {
  message: string;
  success: boolean;
  user: User;
}

export interface TwoFactResponse {
  message?: string;
  success: boolean;
  secure?: boolean;
}

export interface ProfileUpdateInput {
  username?: string;
  avatar?: File | null;
}
