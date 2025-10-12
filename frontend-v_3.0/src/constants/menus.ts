// src/constants/menus.ts

export interface MenuItem {
  id: string;
  icon: string; // Material Icons 이름
  label: string; // 화면에 표시할 텍스트
}

export const MENUS: MenuItem[] = [
  { id: 'home', icon: 'cottage', label: 'HOME' },
  { id: 'huming', icon: 'mic', label: 'HUMING' },
  { id: 'genre', icon: 'music_note', label: 'GENRE' },
  { id: 'explore', icon: 'travel_explore', label: 'EXPLORE' },
  { id: 'build', icon: 'construction', label: 'BUILD' },
  { id: 'my', icon: 'account_circle', label: 'MY' },
];
