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
  const res = await axios.get<Post[]>(`${API_BASE}/list-posts/`, {
    params: { ordering },
  });
  return res.data;
};

export const createPost = async (
  title: string,
  content: string,
  accessToken: string
) => {
  const res = await axios.post(
    `${API_BASE}/create-post/`,
    { title, content },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};


// existing functions

export async function getPostById(id: number) {
  // Replace with your actual API call logic
  const response = await fetch(`/api/posts/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }
  return await response.json();
}

export function updatePost(
  id: number,
  title: string,
  content: string,
  accessToken: string
) {
  // implementation
}