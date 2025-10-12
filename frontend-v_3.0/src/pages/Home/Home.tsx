import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import Header from '../../components/layout/Header';
import HeroSection from '../../components/common/HeroSection';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/my');
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
    <div className={styles.mainContent}>
      <Header onLogin={handleLogin} />
      <HeroSection onStartClick={handleStart} onIntroClick={handleIntro} onContactClick={handleContact} />
    </div>
  );
};

export default Home;
