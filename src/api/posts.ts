import axios from 'axios';

export interface Post {
  postId: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
}

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
