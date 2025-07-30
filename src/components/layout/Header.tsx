import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import Button from '../ui/Button';
import type { HeaderProps } from '../../types';
import { AuthContext } from '../../context/AuthContext';

const Header: React.FC<HeaderProps> = ({ onLogin }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    if (onLogin) {
      onLogin();
    } else {
      navigate('/login');
    }
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
      alert('로그아웃되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃에 실패했습니다.');
    }
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.startButtonWrapper}>
        {user ? (
          <Button variant="secondary" size="md" onClick={handleLogoutClick}>
            Logout
          </Button>
        ) : (
          <Button variant="primary" size="md" onClick={handleLoginClick}>
            Login
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
