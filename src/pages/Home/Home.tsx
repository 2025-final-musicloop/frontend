import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import HeroSection from '../../components/common/HeroSection';

const Home: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>('home');
  const navigate = useNavigate();

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);
    if (menuId === 'home') {
      navigate('/');
    } else {
      navigate(`/${menuId}`);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleStart = () => {
    // ✨ 회원가입 페이지로 이동!
    navigate('/register');
  };

  const handleIntro = () => {
    console.log('서비스 소개 클릭');
  };

  const handleContact = () => {
    console.log('문의하기 클릭');
  };

  return (
    <div className={styles.homeContainer}>
      <Sidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
      <main className={styles.mainContent}>
        <Header onLogin={handleLogin} />
        <HeroSection onStartClick={handleStart} onIntroClick={handleIntro} onContactClick={handleContact} />
      </main>
    </div>
  );
};

export default Home;
