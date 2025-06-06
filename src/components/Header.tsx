import React from 'react';
import styles from './Header.module.css';
import Button from './Button';
import type { HeaderProps } from '../types';

export const Header: React.FC<HeaderProps> = ({ onLogin }) => {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.startButtonWrapper}>
        <Button variant="primary" size="md" onClick={onLogin}>
          Login
        </Button>
      </div>
    </header>
  );
};

export default Header;
