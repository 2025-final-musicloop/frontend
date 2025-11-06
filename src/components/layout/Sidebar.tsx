import React from 'react';
import styles from './Sidebar.module.css';
import SidebarItem from './SidebarItem';
import { MENUS } from '../../constants/menus';
import type { SidebarProps } from '../../types';

export const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onMenuClick }) => {
  return (
    <aside className={styles.sidebarContainer}>
      {MENUS.map((menu) => (
        <SidebarItem
          key={menu.id}
          iconName={menu.icon}
          label={menu.label}
          isActive={activeMenu === menu.id}
          onClick={() => onMenuClick && onMenuClick(menu.id)}
        />
      ))}
    </aside>
  );
};

export default Sidebar;
