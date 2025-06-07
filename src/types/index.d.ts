// src/types/index.d.ts

// --------------------------------------------------------
// 1) 메뉴 관련 타입
export interface MenuItem {
  id: string;
  icon: string;
  label: string;
}

// --------------------------------------------------------
// 2) Button 컴포넌트 Props
export type ButtonVariant = 'primary' | 'secondary' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  border?: 'primary' | 'secondary';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  className?: string;
}

// --------------------------------------------------------
// 3) Sidebar 관련 Props
export interface SidebarProps {
  activeMenu: string;
  onMenuClick?: (menuId: string) => void;
}

// --------------------------------------------------------
// 4) SidebarItem Props
export interface SidebarItemProps {
  iconName: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

// --------------------------------------------------------
// 5) HeroSection Props
export interface HeroSectionProps {
  onStartClick?: () => void;
  onIntroClick?: () => void;
  onContactClick?: () => void;
}

// --------------------------------------------------------
// 6) Blob 컴포넌트 Props
export interface BlobProps {
  top?: string; // ex: "25%"
  left?: string;
  bottom?: string;
  right?: string;
  bgColor: string; // ex: "bg-purple-300"
  delay?: number; // 애니메이션 지연(ms)
}

// --------------------------------------------------------
// 7) Header 관련 Props
export interface HeaderProps {
  onLogin?: () => void;
  isLoggedIn?: boolean;
}

// --------------------------------------------------------
// 8) MusicCard 관련 Props
export interface MusicCardProps {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  audioSrc: string;
}
