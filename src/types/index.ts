// User types
export interface User {
  id: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// NTNU Account types
export interface NtnuAccount {
  id: string;
  student_id: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}

export interface NtnuAccountCreate {
  student_id: string;
  password: string;
}

// Course types
export interface TrackedCourse {
  id: string;
  ntnu_account_id: string;
  course_code: string;
  course_name: string;
  class_code: string | null;
  teacher_name: string | null;
  is_enabled: boolean;
  auto_enroll: boolean;
  priority: number;
  current_enrolled: number;
  max_capacity: number;
  last_checked_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TrackedCourseCreate {
  ntnu_account_id: string;
  course_code: string;
  course_name: string;
  class_code?: string;
  teacher_name?: string;
  is_enabled?: boolean;
  auto_enroll?: boolean;
  priority?: number;
}

export interface TrackedCourseUpdate {
  is_enabled?: boolean;
  auto_enroll?: boolean;
  priority?: number;
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: "success" | "warning" | "error" | "info";
  related_course_id: string | null;
  is_read: boolean;
  created_at: string;
}

// API Response types
export interface ApiError {
  detail: string;
}
