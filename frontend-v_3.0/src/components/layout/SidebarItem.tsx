import React from 'react';
import classNames from 'classnames';
import styles from './SidebarItem.module.css';
import type { SidebarItemProps } from '../../types';

export const SidebarItem: React.FC<SidebarItemProps> = ({ iconName, label, isActive = false, onClick }) => {
  const combined = classNames(styles.sidebarItem, {
    [styles.active]: isActive,
    [styles.inactive]: !isActive,
  });

  return (
    <div onClick={onClick} className={combined}>
      <span className={styles.icon}>
        <span className="material-icons-outlined">{iconName}</span>
      </span>
      <span className={styles.text}>{label}</span>
    </div>
  );
};

export default SidebarItem;
