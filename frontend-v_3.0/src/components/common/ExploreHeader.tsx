import React, { useState } from 'react';
import styles from './ExploreHeader.module.css';
import type { ExploreHeaderProps } from '../../types';

export const ExploreHeader: React.FC<ExploreHeaderProps> = ({ isLoggedIn }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className={styles.headerContainer}>
      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="검색창"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <span className={styles.searchIcon}>
          <span className="material-icons">search</span>
        </span>
      </div>
      {isLoggedIn && (
        <button className={styles.notificationButton}>
          <span className="material-icons">notifications</span>
        </button>
      )}
    </header>
  );
};

export default ExploreHeader;
