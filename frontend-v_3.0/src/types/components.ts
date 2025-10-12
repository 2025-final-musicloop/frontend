import { ReactNode } from 'react';
import { User, Post, Music } from './api';

// 공통 컴포넌트 Props
export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface BackButtonProps {
  onClick?: () => void;
  className?: string;
}

// 레이아웃 컴포넌트 Props
export interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  onLogin?: () => void;
  children?: ReactNode;
}

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeMenu?: string;
  onMenuClick?: (menuId: string) => void;
  className?: string;
}

export interface SidebarItemProps {
  icon?: ReactNode;
  iconName?: string;
  label: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

// 음악 관련 컴포넌트 Props
export interface MusicCardProps {
  id: number;
  title: string;
  artist: string;
  music?: Music;
  onPlay?: (music: Music) => void;
  onPause?: (music: Music) => void;
  onLike?: (music: Music) => void;
  isPlaying?: boolean;
  isLiked?: boolean;
  className?: string;
}

// 공통 섹션 컴포넌트 Props
export interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  onStartClick?: () => void;
  onIntroClick?: () => void;
  onContactClick?: () => void;
  backgroundImage?: string;
  className?: string;
}

export interface ExploreHeaderProps {
  title?: string;
  subtitle?: string;
  searchValue?: string;
  isLoggedIn?: boolean;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  className?: string;
}

export interface BlobBackgroundProps {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'gradient';
}
