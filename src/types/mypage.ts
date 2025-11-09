// src/types/mypage.ts
import { User, Post, Music } from './api';

// ========== 사용자 프로필 관련 ==========

// 사용자 프로필 확장
export interface UserProfile extends User {
  bio?: string;
  profile_image?: string;
  posts_count?: number;
  favorites_count?: number;
  followers_count?: number;
  following_count?: number;
}

// 통계 정보
export interface UserStatistics {
  total_posts: number;
  total_likes: number;
  total_comments: number;
  total_music: number;
  total_favorites: number;
}

// 프로필 업데이트 요청
export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  bio?: string;
  profile_image?: File;
}

// 비밀번호 변경 요청
export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

// ========== 내 게시물/음악 조회 파라미터 ==========

// 내 게시물 조회 파라미터
export interface MyPostsParams {
  ordering?: '-created_at' | 'created_at' | '-likes_count' | 'likes_count';
  search?: string;
  page?: number;
  limit?: number;
}

// 내 음악 조회 파라미터
export interface MyMusicParams {
  ordering?: '-created_at' | 'created_at';
  search?: string;
  page?: number;
  limit?: number;
}

// ========== 좋아요 관련 ==========

// 좋아요한 게시물
export interface FavoritePost {
  id: number;
  post: Post;  // ✅ api.ts에서 가져온 Post 사용
  created_at: string;
}

// 좋아요한 음악
export interface FavoriteMusic {
  id: number;
  music: Music;  // ✅ api.ts에서 가져온 Music 사용
  created_at: string;
}

// ========== 작업물 관련 ==========

// 작업물 (Work)
export interface Work {
  id: number;
  title: string;
  created_at: string;
  updated_at?: string;
  audio_url?: string;
  genre?: string;
}

// 즐겨찾기 (Favorite)
export interface Favorite {
  id: number;
  title: string;
  type: 'work' | 'post';
  author?: string;
  created_at: string;
}

// ❌ Post 중복 정의 제거됨
// ❌ UserProfile 중복 정의 제거됨
