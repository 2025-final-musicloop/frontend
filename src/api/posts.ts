// src/api/posts.ts
import axios from 'axios';

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

const API_BASE = 'http://localhost:8000/api/posts';

// 게시물 목록 조회
export const getPosts = async (ordering: string = '-created_at') => {
  const res = await axios.get<Post[]>(`${API_BASE}/list-posts/?ordering=${ordering}`);
  return res.data;
};

// 게시물 생성
export const createPost = async (
  postData: {
    title: string;
    content: string;
    imageFile?: File | null;
    audioFile?: File | null;
  },
  accessToken: string,
) => {
  const formData = new FormData();
  formData.append('title', postData.title);
  formData.append('content', postData.content);

  if (postData.imageFile) {
    formData.append('image', postData.imageFile);
  }
  if (postData.audioFile) {
    formData.append('audio_file', postData.audioFile);
  }

  const res = await axios.post(`${API_BASE}/create-post/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

// 음악 게시물 생성
export const createMusicPost = async (
  params: {
    title: string;
    content: string;
    audioFile: File;
    details?: Record<string, unknown>;
    author?: string | number;
  },
  accessToken: string,
) => {
  const formData = new FormData();
  formData.append('title', params.title);
  formData.append('content', params.content);
  formData.append('audio_file', params.audioFile);
  
  if (params.details) {
    formData.append('details', JSON.stringify(params.details));
  }

  const res = await axios.post(`${API_BASE}/create-post/`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// 🆕 게시물 상세 조회 (좋아요 정보 포함)
export const getPostDetail = async (postId: number, accessToken?: string) => {
  const res = await axios.get<Post>(`${API_BASE}/${postId}/`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
  });
  return res.data;
};

// 게시물 수정을 위한 데이터 조회 (기존 유지)
export const getPostById = async (postId: number, accessToken?: string) => {
  const res = await axios.get<Post>(`${API_BASE}/${postId}/`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
  });
  return res.data;
};

// 게시물 수정
export const updatePost = async (
  postId: number,
  postData: {
    title: string;
    content: string;
    imageFile?: File | null;
    audioFile?: File | null;
  },
  accessToken: string,
) => {
  const formData = new FormData();
  formData.append('title', postData.title);
  formData.append('content', postData.content);

  if (postData.imageFile) {
    formData.append('image', postData.imageFile);
  }
  if (postData.audioFile) {
    formData.append('audio_file', postData.audioFile);
  }

  const res = await axios.patch(
    `${API_BASE}/update-post/${postId}/`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

// 게시물 삭제
export const deletePost = async (postId: number, accessToken: string) => {
  const res = await axios.delete(`${API_BASE}/delete-post/${postId}/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

// 🆕 게시물 좋아요(즐겨찾기) 토글
export const togglePostLike = async (
  postId: number,
  accessToken: string
): Promise<{ message: string; is_liked: boolean }> => {
  const res = await axios.post<{ message: string; is_liked: boolean }>(
    `${API_BASE}/${postId}/like/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};
