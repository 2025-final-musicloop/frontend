import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MusicCard.module.css';
import type { MusicCardProps } from '../types';

const MusicCard: React.FC<MusicCardProps> = ({ id, title, artist, imageUrl, audioSrc }) => {
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // Link로의 이벤트 전파를 막습니다.
    console.log(`Playing ${audioSrc}`);
    // 실제 오디오 재생 로직을 여기에 추가합니다.
  };

  return (
    <Link to={`/explore/${id}`} className={styles.card}>
      <img src={imageUrl} alt={`${artist} profile`} className={styles.profileImage} />
      <div className={styles.info}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.artist}>{artist}</p>
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBar} style={{ width: '60%' }}></div>
        </div>
      </div>
      <button onClick={handlePlay} className={styles.playButton}>
        <span className="material-icons">play_arrow</span>
      </button>
    </Link>
  );
};

export default MusicCard;
