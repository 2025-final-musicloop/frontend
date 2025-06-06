import React, { useState } from 'react';
import styles from './Home.module.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import HeroSection from '../../components/HeroSection';

const Home: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>('home');

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);
    // React Router로 페이지 이동이 필요하면 여기서 navigate(menuId) 등을 호출
  };

  const handleLogin = () => {
    console.log('로그인 클릭');
  };

  const handleStart = () => {
    console.log('지금 시작하기 클릭');
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
