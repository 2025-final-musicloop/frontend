// src/types/mypage.ts
import { User, Post, Music } from './api';

// 사용자 프로필 확장
export interface UserProfile extends User {
  bio?: string;
  profile_image?: string;
  posts_count?: number;
  favorites_count?: number;
  followers_count?: number;
  following_count?: number;
}

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

// 좋아요한 게시물
export interface FavoritePost {
  id: number;
  post: Post;
  created_at: string;
}

// 좋아요한 음악
export interface FavoriteMusic {
  id: number;
  music: Music;
  created_at: string;
}

// 기존 타입들은 그대로 두고...

// 👇 아래 타입들만 추가
export interface Work {
  id: number;              // ✅ string이 아니라 number
  title: string;
  created_at: string;      // ✅ createdAt이 아니라 created_at
  updated_at?: string;
  audio_url?: string;
  genre?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  views?: number;
  likes?: number;
  comments?: number;
}

export interface Favorite {
  id: number;
  title: string;
  type: 'work' | 'post';
  author?: string;
  created_at: string;
}

export interface UserProfile {
  username: string;
  email: string;
  bio: string;
  avatar: string;
}
