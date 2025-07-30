// API 타입들
export * from './api';

// 컴포넌트 Props 타입들
export * from './components';

// 전역 타입들
import type { User } from './api';

export interface AppState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface Theme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  requiresAuth?: boolean;
  title?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
}

export interface SearchFilters {
  query: string;
  category?: string;
  sortBy?: 'title' | 'artist' | 'created_at' | 'likes';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
