import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MusicCard.module.css';
import type { MusicCardProps } from '../../types';

const MusicCard: React.FC<MusicCardProps> = ({ id, title, artist, music }) => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35); // 임시로 35% 설정

  // 부족한 정보 처리
  const displayTitle = title || music?.title || '[제목]추가필요';
  const displayArtist = artist || music?.artist || '[제작자]추가필요';
  const displayImageUrl = music?.cover_image || '';
  const displayAudioSrc = music?.file_url || '';

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPlaying(!isPlaying);
    // 오디오 재생 로직
    console.log(`Playing ${displayTitle}`);
  };

  const handleDetailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // 상세 페이지로 이동
    navigate(`/post/${id}`);
  };

  return (
    <div className={styles.card}>
      {/* 프로필 이미지 (왼쪽) */}
      <div className={styles.profileSection}>
        <div className={styles.profileImage}>
          {displayImageUrl ? (
            <img src={displayImageUrl} alt={`${displayArtist} profile`} />
          ) : (
            <span className={styles.profilePlaceholder}>{displayArtist?.charAt(0) || 'U'}</span>
          )}
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className={styles.content}>
        {/* 상단 정보 영역 */}
        <div className={styles.infoSection}>
          <div className={styles.titleSection}>
            <h3 className={styles.title}>{displayTitle}</h3>
          </div>
          <div className={styles.artistSection}>
            <span className={styles.artist}>{displayArtist}</span>
            <button onClick={handleDetailClick} className={styles.detailButton}>
              상세보기
            </button>
          </div>
        </div>

        {/* 진행바 */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
          </div>
          <span className={styles.progressText}>{progress}%</span>
        </div>
      </div>

      {/* 플레이 버튼 (오른쪽) */}
      <button onClick={handlePlay} className={styles.playButton}>
        <span className={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</span>
      </button>
    </div>
  );
};

export default MusicCard;
