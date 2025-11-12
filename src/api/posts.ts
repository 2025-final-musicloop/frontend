// src/api/posts.ts
import axios from 'axios';

export interface Post {
  id: number;                // postId 대신 id 사용
  postId?: number;           // 호환성을 위해 유지 (deprecated)
  title: string;
  content: string;
  author: string;            // 백엔드가 string으로 반환
  created_at: string;
  updated_at?: string;       // 추가
  audio_file?: string;
  image?: string;
  view_count?: number;       // MyPosts에서 사용
  like_count?: number;       // MyPosts에서 사용
  likes_count?: number;      // 호환성
  comments_count?: number;   // 호환성
  is_liked?: boolean;        // ✅ 추가: 사용자가 좋아요했는지 여부
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

// ✅ 수정: 게시물 상세 URL 변경 (posts/ 접두사 제거)
export const getPostById = async (postId: number, accessToken?: string) => {
  const res = await axios.get<Post>(`${API_BASE}/${postId}/`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
  });
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

// ========== ✅ 마이페이지용 API 추가 ==========

// 내가 작성한 게시물 목록 조회
export const getMyPosts = async (params?: {
  ordering?: string;
  page?: number;
  limit?: number;
}, accessToken?: string) => {
  const token = accessToken || localStorage.getItem('access_token') || '';
  
  const queryParams = new URLSearchParams();
  if (params?.ordering) queryParams.append('ordering', params.ordering);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  const queryString = queryParams.toString();
  const url = `${API_BASE}/my-posts/${queryString ? `?${queryString}` : ''}`;

  const res = await axios.get<Post[]>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// 좋아요한 게시물 목록 조회
export const getFavoritePosts = async (params?: {
  ordering?: string;
  page?: number;
  limit?: number;
}, accessToken?: string) => {
  const token = accessToken || localStorage.getItem('access_token') || '';
  
  const queryParams = new URLSearchParams();
  if (params?.ordering) queryParams.append('ordering', params.ordering);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  const queryString = queryParams.toString();
  const url = `${API_BASE}/favorites/${queryString ? `?${queryString}` : ''}`;

  const res = await axios.get<Post[]>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// 게시물 좋아요 토글
export const togglePostLike = async (postId: number, accessToken?: string) => {
  const token = accessToken || localStorage.getItem('access_token') || '';
  
  const res = await axios.post<{
    message: string;
    is_liked: boolean;
    likes_count: number;
  }>(
    `${API_BASE}/${postId}/like/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
