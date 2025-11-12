// API 응답 타입들
export interface User {
  id: number;
  username: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface Post {
  id: number;                // postId 대신 id 사용
  postId?: number;           // 호환성을 위해 유지 (deprecated)
  title: string;
  content: string;
  author: string;            // User → string으로 변경
  created_at: string;
  updated_at?: string;       // optional로 변경
  audio_file?: string;       // 추가
  image?: string;            // 추가
  view_count?: number;       // 추가
  like_count?: number;       // 추가
  likes_count?: number;      // 호환성 유지
  comments_count?: number;   // 호환성 유지
}

export interface CreatePostRequest {
  title: string;
  content: string;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
}

export interface Music {
  id: number;
  title: string;
  artist: string;
  album?: string;
  duration?: number;
  file_url?: string;
  cover_image?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
