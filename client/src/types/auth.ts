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
}

export interface AuthResponse {
  message: string;
  success: boolean;
  userResponse: User;
}
