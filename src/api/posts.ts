import axios from 'axios';

export interface Post {
  id: number;
  postId?: number; // 호환성을 위해 유지 (deprecated)
  title: string;
  content: string;
  author:
    | string
    | {
        // string 또는 객체 형태
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
  const res = await axios.get<any>(`${API_BASE}/list-posts/?ordering=${ordering}`);
  console.log('📡 API 원본 응답:', res.data);
  console.log('📡 응답 타입:', typeof res.data);
  console.log('📡 배열 여부:', Array.isArray(res.data));
  
  let postsData = res.data;
  
  // 응답이 배열이 아닌 경우 처리 (예: { results: [...] })
  if (!Array.isArray(postsData)) {
    console.log('⚠️ 응답이 배열이 아닙니다. 구조 확인:', Object.keys(postsData));
    if (postsData.results && Array.isArray(postsData.results)) {
      postsData = postsData.results;
    } else if (postsData.data && Array.isArray(postsData.data)) {
      postsData = postsData.data;
    }
  }
  
  // 각 게시글 데이터 정규화 (ID 필드 매핑)
  const normalizedPosts: Post[] = postsData.map((post: any, index: number) => {
    // ID 필드 찾기 (다양한 필드명 대응)
    const postId = post.id ?? post.post_id ?? post.pk ?? post.postId ?? null;
    
    // ID가 없으면 경고 로그 출력
    if (!postId) {
      console.error(`❌ 게시글 ${index}에 ID가 없습니다:`, {
        원본_데이터: post,
        가능한_ID_필드: {
          id: post.id,
          post_id: post.post_id,
          pk: post.pk,
          postId: post.postId
        },
        모든_키: Object.keys(post)
      });
    }
    
    return {
      ...post,
      id: postId || 0,
      postId: postId,
    } as Post;
  }).filter((post: Post, index: number) => {
    // ID가 유효한 게시글만 반환
    const isValid = post.id && post.id > 0;
    if (!isValid) {
      console.warn(`⚠️ 게시글 ${index}가 ID가 없어 필터링됨:`, post);
    }
    return isValid;
  });
  
  console.log('✅ 정규화된 게시글:', normalizedPosts);
  console.log(`✅ 총 ${normalizedPosts.length}개의 유효한 게시글 반환`);
  return normalizedPosts;
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

// ✅ 수정됨: 상세 조회용 엔드포인트로 변경
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

  const res = await axios.patch(`${API_BASE}/update-post/${postId}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`,
    },
  });
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

// 게시물 좋아요 토글
export const togglePostLike = async (postId: number, accessToken: string) => {
  const res = await axios.post(
    `${API_BASE}/${postId}/like/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};
