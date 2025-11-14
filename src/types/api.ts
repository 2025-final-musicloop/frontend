// src/types/api.ts

// 기본 사용자 타입
export interface User {
  id: number;
  username: string;
  email: string;
  profile_image?: string;
  bio?: string;
}

// 게시물 타입
export interface Post {
  id: number;
  postId?: number;  // 호환성을 위해 유지 (deprecated)
  title: string;
  content: string;
  author: string | {  // string 또는 객체 형태
    id: number;
    username: string;
  };
  created_at: string;
  updated_at?: string;
  audio_file?: string;
  image?: string;
  
  // 상세 조회시 추가 필드
  likes_count?: number;
  is_liked?: boolean;
  
  // 기존 필드 (호환성)
  view_count?: number;
  like_count?: number;
  comments_count?: number;
}

// 음악 타입
export interface Music {
  id: number;
  title: string;
  content?: string;
  author?: string | {
    id: number;
    username: string;
  };
  audio_file: string;
  genre?: string;
  created_at: string;
  updated_at?: string;
  likes_count?: number;
  is_liked?: boolean;
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// API 에러 타입
export interface ApiError {
  error?: string;
  detail?: string;
  message?: string;
}
