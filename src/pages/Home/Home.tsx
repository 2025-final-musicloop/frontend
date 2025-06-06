import React, { useState } from 'react';
import styles from './Home.module.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import HeroSection from '../../components/HeroSection';

/**
 * Home 컴포넌트
 *
 * 메인 페이지의 전체 레이아웃을 구성합니다.
 * 사이드바, 헤더, 그리고 히어로 섹션을 포함합니다.
 */
const Home: React.FC = () => {
  // 현재 활성화된 메뉴를 추적하는 상태입니다. 초기값은 'home'입니다.
  const [activeMenu, setActiveMenu] = useState<string>('home');

  /**
   * 메뉴 항목 클릭 시 호출되는 핸들러 함수입니다.
   * @param menuId - 클릭된 메뉴의 식별자
   */
  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);
    // React Router로 페이지 이동이 필요하면 여기서 navigate(menuId) 등을 호출
  };

  /**
   * 헤더의 로그인 버튼 클릭 시 호출되는 핸들러 함수입니다.
   */
  const handleLogin = () => {
    console.log('로그인 클릭');
  };

  /**
   * 히어로 섹션의 '지금 시작하기' 버튼 클릭 시 호출되는 핸들러 함수입니다.
   */
  const handleStart = () => {
    console.log('지금 시작하기 클릭');
  };

  /**
   * 히어로 섹션의 '서비스 소개' 버튼 클릭 시 호출되는 핸들러 함수입니다.
   */
  const handleIntro = () => {
    console.log('서비스 소개 클릭');
  };

  /**
   * 히어로 섹션의 '문의하기' 버튼 클릭 시 호출되는 핸들러 함수입니다.
   */
  const handleContact = () => {
    console.log('문의하기 클릭');
  };

  return (
    <div className={styles.homeContainer}>
      {/* 사이드바 컴포넌트: 현재 활성화된 메뉴와 메뉴 클릭 핸들러를 전달합니다. */}
      <Sidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
      <main className={styles.mainContent}>
        {/* 헤더 컴포넌트: 로그인 버튼 클릭 핸들러를 전달합니다. */}
        <Header onLogin={handleLogin} />
        {/* 히어로 섹션 컴포넌트: 시작, 소개, 문의 버튼 클릭 핸들러를 전달합니다. */}
        <HeroSection onStartClick={handleStart} onIntroClick={handleIntro} onContactClick={handleContact} />
      </main>
    </div>
  );
};

export default Home;
