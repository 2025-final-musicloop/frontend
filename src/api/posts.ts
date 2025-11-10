// src/api/posts.ts

import axios from 'axios';

export interface Post {
  postId: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  // 파일 URL을 받을 수 있도록 필드 추가
  audio_file?: string;
  image?: string;
}

const API_BASE = 'http://localhost:8000/api/posts';

export const getPosts = async (ordering: string = '-created_at') => {
  const res = await axios.get<Post[]>(`${API_BASE}/list-posts/?ordering=${ordering}`);
  return res.data;
};

// ⭐️ 파일 업로드를 위해 FormData를 사용하도록 수정한 함수입니다.
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
  // 백엔드 모델 필드명에 맞게 'audio_file'로 보냅니다.
  formData.append('audio_file', params.audioFile); 
  if (params.details) {
    formData.append('details', JSON.stringify(params.details));
  }
  
  // create-post API는 토큰에서 author를 자동으로 인식하므로 author는 보낼 필요가 없습니다.

  const res = await axios.post(`${API_BASE}/create-post/`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};


export const getPostById = async (postId: number, accessToken?: string) => {
  
  // ❗️ API_BASE에 이미 /api/posts가 포함되어 있으므로 중복되는 경로를 제거합니다.
  // ❗️ 수정 전: `${API_BASE}/api/posts/${postId}/`
  const res = await axios.get<Post>(
    `${API_BASE}/${postId}/`, // 👈 수정 후
    { 
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    }
  );
  return res.data;
};

// 게시글 수정
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

  const res = await axios.patch(  // ⭐️ put → patch로 변경
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

// 게시글 삭제
export const deletePost = async (postId: number, accessToken: string) => {
  const res = await axios.delete(`${API_BASE}/delete-post/${postId}/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};