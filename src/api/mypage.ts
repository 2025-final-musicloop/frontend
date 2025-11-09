// src/api/mypage.ts
import axios from 'axios';
import {
  UserProfile,
  UserStatistics,
  MyPostsParams,
  MyMusicParams,
  UpdateProfileRequest,
  ChangePasswordRequest,
  FavoritePost,
  FavoriteMusic,
} from '../types/mypage';
import { Post, Music, PaginatedResponse } from '../types/api';

const API_BASE = 'http://localhost:8000/api';

// localStorage에서 토큰 가져오기
const getAccessToken = (): string => {
  return localStorage.getItem('accessToken') || '';
};

// ========== 프로필 관련 ==========

// 내 프로필 조회
export const getMyProfile = async (accessToken?: string): Promise<UserProfile> => {
  const token = accessToken || getAccessToken();
  const res = await axios.get<UserProfile>(`${API_BASE}/users/me/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// 프로필 수정
export const updateProfile = async (
  data: UpdateProfileRequest,
  accessToken?: string
): Promise<UserProfile> => {
  const token = accessToken || getAccessToken();
  
  // 이미지가 있으면 FormData 사용
  if (data.profile_image) {
    const formData = new FormData();
    if (data.username) formData.append('username', data.username);
    if (data.email) formData.append('email', data.email);
    if (data.bio) formData.append('bio', data.bio);
    formData.append('profile_image', data.profile_image);

    const res = await axios.put<UserProfile>(`${API_BASE}/users/me/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } else {
    // 일반 JSON 데이터
    const res = await axios.put<UserProfile>(`${API_BASE}/users/me/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
};

// 비밀번호 변경
export const changePassword = async (
  data: ChangePasswordRequest,
  accessToken?: string
): Promise<{ message: string }> => {
  const token = accessToken || getAccessToken();
  const res = await axios.post<{ message: string }>(
    `${API_BASE}/users/change-password/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// 통계 조회
export const getMyStatistics = async (accessToken?: string): Promise<UserStatistics> => {
  const token = accessToken || getAccessToken();
  const res = await axios.get<UserStatistics>(`${API_BASE}/users/me/statistics/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// ========== 내 게시물 관련 ========== ⭐ 핵심 기능!

// 내 게시물 전체 조회 (자신의 ID로 검색)
export const getMyPosts = async (
  params?: MyPostsParams,
  accessToken?: string
): Promise<PaginatedResponse<Post>> => {
  const token = accessToken || getAccessToken();
  
  // 쿼리 파라미터 생성
  const queryParams = new URLSearchParams();
  if (params?.ordering) queryParams.append('ordering', params.ordering);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  const queryString = queryParams.toString();
  const url = `${API_BASE}/posts/my-posts/${queryString ? `?${queryString}` : ''}`;

  const res = await axios.get<PaginatedResponse<Post>>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// 내 음악 게시물 조회
export const getMyMusic = async (
  params?: MyMusicParams,
  accessToken?: string
): Promise<PaginatedResponse<Music>> => {
  const token = accessToken || getAccessToken();
  
  const queryParams = new URLSearchParams();
  if (params?.ordering) queryParams.append('ordering', params.ordering);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  const queryString = queryParams.toString();
  const url = `${API_BASE}/music/my-music/${queryString ? `?${queryString}` : ''}`;

  const res = await axios.get<PaginatedResponse<Music>>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// ========== 좋아요 관련 ==========

// 내가 좋아요한 게시물 조회
export const getMyFavoritePosts = async (
  page: number = 1,
  accessToken?: string
): Promise<PaginatedResponse<FavoritePost>> => {
  const token = accessToken || getAccessToken();
  const res = await axios.get<PaginatedResponse<FavoritePost>>(
    `${API_BASE}/posts/favorites/?page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// 내가 좋아요한 음악 조회
export const getMyFavoriteMusic = async (
  page: number = 1,
  accessToken?: string
): Promise<PaginatedResponse<FavoriteMusic>> => {
  const token = accessToken || getAccessToken();
  const res = await axios.get<PaginatedResponse<FavoriteMusic>>(
    `${API_BASE}/music/favorites/?page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// 게시물 좋아요 토글
export const togglePostLike = async (
  postId: number,
  accessToken?: string
): Promise<{ message: string; is_liked: boolean }> => {
  const token = accessToken || getAccessToken();
  const res = await axios.post<{ message: string; is_liked: boolean }>(
    `${API_BASE}/posts/${postId}/like/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
