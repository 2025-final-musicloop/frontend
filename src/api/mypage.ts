import api from './client';
import {
  UserProfile,
  MusicLoop,
  MusicLoopFormData,
  Favorite,
  LoopStatistics,
  PasswordChangeData,
  ApiResponse,
} from '../types/mypage';

// ========== 프로필 관련 ==========

// 내 프로필 조회
export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>('/mypage/profile/');
  return response.data;
};

// 프로필 수정
export const updateProfile = async (
  data: Partial<UserProfile>
): Promise<ApiResponse<UserProfile>> => {
  const response = await api.put<ApiResponse<UserProfile>>(
    '/mypage/profile/update/',
    data
  );
  return response.data;
};

// 프로필 이미지 업로드
export const uploadProfileImage = async (
  file: File
): Promise<ApiResponse<UserProfile>> => {
  const formData = new FormData();
  formData.append('profile_image', file);

  const response = await api.post<ApiResponse<UserProfile>>(
    '/mypage/profile/image/upload/',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

// 프로필 이미지 삭제
export const deleteProfileImage = async (): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(
    '/mypage/profile/image/delete/'
  );
  return response.data;
};

// 비밀번호 변경
export const changePassword = async (
  data: PasswordChangeData
): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>(
    '/mypage/profile/password/',
    data
  );
  return response.data;
};

// ========== 내 루프 관련 ==========

// 내 루프 목록 조회
export const getMyLoops = async (params?: {
  is_public?: boolean;
  genre?: string;
  search?: string;
}): Promise<ApiResponse<MusicLoop[]>> => {
  const response = await api.get<ApiResponse<MusicLoop[]>>('/mypage/myloops/', {
    params,
  });
  return response.data;
};

// 특정 루프 조회
export const getLoop = async (id: number): Promise<MusicLoop> => {
  const response = await api.get<MusicLoop>(`/mypage/myloops/${id}/`);
  return response.data;
};

// 루프 생성
export const createLoop = async (
  data: MusicLoopFormData
): Promise<ApiResponse<MusicLoop>> => {
  const formData = new FormData();

  formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  if (data.audio_file) formData.append('audio_file', data.audio_file);
  if (data.thumbnail) formData.append('thumbnail', data.thumbnail);
  if (data.bpm) formData.append('bpm', data.bpm.toString());
  if (data.duration) formData.append('duration', data.duration.toString());
  if (data.genre) formData.append('genre', data.genre);
  if (data.tags) formData.append('tags', JSON.stringify(data.tags));
  if (data.is_public !== undefined)
    formData.append('is_public', data.is_public.toString());

  const response = await api.post<ApiResponse<MusicLoop>>(
    '/mypage/myloops/',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

// 루프 수정
export const updateLoop = async (
  id: number,
  data: Partial<MusicLoopFormData>
): Promise<ApiResponse<MusicLoop>> => {
  const formData = new FormData();

  if (data.title) formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  if (data.audio_file) formData.append('audio_file', data.audio_file);
  if (data.thumbnail) formData.append('thumbnail', data.thumbnail);
  if (data.bpm) formData.append('bpm', data.bpm.toString());
  if (data.duration) formData.append('duration', data.duration.toString());
  if (data.genre) formData.append('genre', data.genre);
  if (data.tags) formData.append('tags', JSON.stringify(data.tags));
  if (data.is_public !== undefined)
    formData.append('is_public', data.is_public.toString());

  const response = await api.patch<ApiResponse<MusicLoop>>(
    `/mypage/myloops/${id}/`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

// 루프 삭제
export const deleteLoop = async (id: number): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(
    `/mypage/myloops/${id}/`
  );
  return response.data;
};

// 루프 통계
export const getLoopStatistics = async (): Promise<LoopStatistics> => {
  const response = await api.get<LoopStatistics>('/mypage/loops/statistics/');
  return response.data;
};

// ========== 좋아요 관련 ==========

// 좋아요 목록
export const getFavorites = async (params?: {
  search?: string;
}): Promise<ApiResponse<Favorite[]>> => {
  const response = await api.get<ApiResponse<Favorite[]>>('/mypage/favorites/', {
    params,
  });
  return response.data;
};

// 좋아요 토글
export const toggleFavorite = async (
  loopId: number
): Promise<{ message: string; is_favorited: boolean }> => {
  const response = await api.post<{ message: string; is_favorited: boolean }>(
    '/mypage/favorites/toggle/',
    { loop_id: loopId }
  );
  return response.data;
};

// 좋아요 상태 확인
export const checkFavorite = async (
  loopId: number
): Promise<{ loop_id: number; is_favorited: boolean }> => {
  const response = await api.get<{ loop_id: number; is_favorited: boolean }>(
    '/mypage/favorites/check/',
    { params: { loop_id: loopId } }
  );
  return response.data;
};
