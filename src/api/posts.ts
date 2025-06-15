// src/api/posts.ts
import axios from 'axios';

export const createPost = async (title: string, content: string, token: string) => {
  const response = await axios.post(
    'http://localhost:8000/api/create-post/',
    { title, content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};
