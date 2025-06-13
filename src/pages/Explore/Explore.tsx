import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import ExploreHeader from '../../components/ExploreHeader';
import MusicCard from '../../components/MusicCard';
import styles from './Explore.module.css';
import type { MusicCardProps } from '../../types';

// 임시 데이터
const dummyMusicData: MusicCardProps[] = [
  {
    id: '1',
    title: '첫 번째 음악',
    artist: '아티스트 1',
    imageUrl: 'https://i.pravatar.cc/150?img=1',
    audioSrc: '/music/song1.mp3',
  },
  {
    id: '2',
    title: '두 번째 음악',
    artist: '아티스트 2',
    imageUrl: 'https://i.pravatar.cc/150?img=2',
    audioSrc: '/music/song2.mp3',
  },
  {
    id: '3',
    title: '세 번째 음악',
    artist: '아티스트 3',
    imageUrl: 'https://i.pravatar.cc/150?img=3',
    audioSrc: '/music/song3.mp3',
  },
];

const Explore: React.FC = () => {
  const [isLoggedIn] = useState(true); // 로그인 상태 임시
  const navigate = useNavigate();

  const handleMenuClick = (menuId: string) => {
    if (menuId === 'home') {
      navigate('/');
    } else {
      navigate(`/${menuId}`);
    }
  };

  const handleWritePost = () => {
    navigate('/write-post');
  };

  return (
    <div className={styles.pageContainer}>
      <Sidebar activeMenu="explore" onMenuClick={handleMenuClick} />
      <main className={styles.mainContent}>
        <ExploreHeader isLoggedIn={isLoggedIn} />

        <div className={styles.boardHeader}>
          <h2 className={styles.boardTitle}>게시판</h2>
          <button onClick={handleWritePost} className={styles.writeButton}>
            글 작성
          </button>
        </div>

        <div className={styles.boardContainer}>
          {dummyMusicData.map((music) => (
            <MusicCard
              key={music.id}
              id={music.id}
              title={music.title}
              artist={music.artist}
              imageUrl={music.imageUrl}
              audioSrc={music.audioSrc}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Explore;
