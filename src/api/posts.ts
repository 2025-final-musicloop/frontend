import axios from 'axios';

export interface Post {
  postId: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
}

const API_BASE = 'http://localhost:8000/api/posts';

export const getPosts = async (ordering: string = '-created_at') => {
  const res = await axios.get<Post[]>(`http://localhost:8000/api/posts/list-posts/?ordering=${ordering}`);
  return res.data;
};

export const createPost = async (title: string, content: string, accessToken: string) => {
  const res = await axios.post(
    'http://localhost:8000/api/posts/create-post/',
    { title, content },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

// 음악 파일과 메타데이터를 함께 업로드하는 게시글 생성 (multipart/form-data)
// 분리된 엔드포인트: create-music-post/
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
  formData.append('audio', params.audioFile);
  if (params.details) {
    formData.append('details', JSON.stringify(params.details));
  }
  if (params.author !== undefined) {
    formData.append('author', String(params.author));
  }

  const res = await axios.post(`${API_BASE}/create-music-post/`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// 단일 게시글 조회
export const getPostById = async (postId: number, accessToken?: string) => {
  const res = await axios.get<Post>(`${API_BASE}/detail-post/${postId}/`, {
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : undefined,
  });
  return res.data;
};

// 게시글 수정
export const updatePost = async (postId: number, title: string, content: string, accessToken: string) => {
  const res = await axios.put(
    `${API_BASE}/update-post/${postId}/`,
    { title, content },
    {
      headers: {
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
