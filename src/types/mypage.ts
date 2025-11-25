// src/types/mypage.ts
import { User, Post, Music } from './api';

// ========== mypage 전용 타입들만 정의 ==========

// ✅ User 프로필 확장
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  bio: string;
  profile_image: string | null;
  created_at: string;
  posts_count?: number;
  favorites_count?: number;
  followers_count?: number;
  following_count?: number;
}

// ✅ 통계 정보
export interface UserStatistics {
  total_posts: number;
  total_likes: number;
  total_comments: number;
  total_music: number;
  total_favorites: number;
}

// ✅ 내 게시물 조회 파라미터
export interface MyPostsParams {
  ordering?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// ✅ 내 음악 조회 파라미터
export interface MyMusicParams {
  ordering?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// ✅ 프로필 업데이트 요청
export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  bio?: string;
  profile_image?: File;
}

// ✅ 비밀번호 변경 요청
export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

// ✅ 좋아요한 게시물
export interface FavoritePost {
  id: number;
  post: {
    id: number;
    title: string;
    content: string;
    author?: {
      username: string;
    };
    created_at: string;
  };
  created_at: string;
}

// ✅ 좋아요한 음악
export interface FavoriteMusic {
  id: number;
  music: {
    id: number;
    title: string;
    author?: {
      username: string;
    };
    genre?: string;
    created_at: string;
  };
  created_at: string;
}
