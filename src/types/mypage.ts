// 사용자 프로필
export interface UserProfile {
  id: number;
  email: string;
  username: string;
  nickname: string;
  profile_image: string | null;
  bio: string;
  date_joined: string;
  loops_count: number;
  favorites_count: number;
}

// 음악 루프
export interface MusicLoop {
  id: number;
  user_email: string;
  user_nickname: string;
  title: string;
  description: string;
  audio_file: string;
  thumbnail: string | null;
  bpm: number | null;
  duration: number | null;
  genre: string;
  tags: string[];
  is_public: boolean;
  play_count: number;
  is_favorited: boolean;
  favorites_count: number;
  is_mine: boolean;
  created_at: string;
  updated_at: string;
}

// 루프 생성/수정 데이터
export interface MusicLoopFormData {
  title: string;
  description?: string;
  audio_file?: File;
  thumbnail?: File;
  bpm?: number;
  duration?: number;
  genre?: string;
  tags?: string[];
  is_public?: boolean;
}

// 좋아요
export interface Favorite {
  id: number;
  loop: MusicLoop;
  created_at: string;
}

// 루프 통계
export interface LoopStatistics {
  total_loops: number;
  total_plays: number;
  total_favorites: number;
  public_loops: number;
  private_loops: number;
}

// API 응답
export interface ApiResponse<T> {
  message?: string;
  data?: T;
  count?: number;
  results?: T[];
}

// 비밀번호 변경
export interface PasswordChangeData {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}
