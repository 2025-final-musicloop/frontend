// src/api/posts.ts
import axiosInstance from './axiosinstance';

// 게시글 타입 정의 (API 명세서에 맞춤)
export interface Post {
  postId: number;
  title: string;
  description: string;
  audioUrl: string;
  createdAt: string;
}

export const createPost = async (title: string, content: string) => {
  console.log('📝 요청 데이터:', { title, content });

  const response = await axiosInstance.post('/create-post/', { title, content });
  return response.data;
};

// 게시글 상세 조회
export const getPost = async (postId: number): Promise<Post> => {
  const response = await axiosInstance.get<Post>(`/posts/${postId}`);
  return response.data;
};

// 게시글 목록 조회 (개별 조회로 목록 생성)
export const getPosts = async (): Promise<Post[]> => {
  try {
    // 더 넓은 범위로 게시글 조회 (1~20번까지 시도)
    const postIds = Array.from({ length: 20 }, (_, i) => i + 1);
    const posts: Post[] = [];
    const errors: any[] = [];

    console.log('🔍 게시글 목록 조회 시작...');

    for (const postId of postIds) {
      try {
        const post = await getPost(postId);
        posts.push(post);
        console.log(`✅ 게시글 ${postId} 조회 성공`);
      } catch (error: any) {
        if (error.response?.status === 404) {
          // 404 오류는 해당 게시글이 없다는 의미이므로 무시
          console.log(`❌ 게시글 ${postId} 없음 (404)`);
        } else {
          // 기타 오류는 기록
          console.error(`❌ 게시글 ${postId} 조회 실패:`, error);
          errors.push(error);
        }
      }
    }

    console.log(`📊 총 ${posts.length}개 게시글 조회 완료`);

    if (errors.length > 0) {
      console.warn('⚠️ 일부 게시글 조회 중 오류 발생:', errors);
    }

    return posts;
  } catch (error) {
    console.error('❌ 게시글 목록 조회 실패:', error);
    throw error;
  }
};
