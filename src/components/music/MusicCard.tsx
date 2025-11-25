import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MusicCard.module.css';
import type { MusicCardProps } from '../../types';

const MusicCard: React.FC<MusicCardProps> = ({ id, title, artist, music }) => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  // ⭐️ 진행 상태와 전체 길이를 위한 상태 추가
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // ⭐️ 오디오 요소를 제어하기 위한 ref 추가
  const audioRef = useRef<HTMLAudioElement>(null);
  // ⭐️ 오디오 메타데이터 로드 및 시간 업데이트를 위한 useEffect
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const setAudioData = () => {
        setDuration(audio.duration);
      };
      const setAudioTime = () => {
        setCurrentTime(audio.currentTime);
      };

      // 메타데이터 로드 시 전체 길이 설정
      audio.addEventListener('loadedmetadata', setAudioData);
      // 재생 시간 업데이트
      audio.addEventListener('timeupdate', setAudioTime);
      // 재생 종료 시 상태 변경
      audio.addEventListener('ended', () => setIsPlaying(false));

      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      return () => {
        audio.removeEventListener('loadedmetadata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('ended', () => setIsPlaying(false));
      };
    }
  }, []);

  // ⭐️ 재생/일시정지 핸들러
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 전체 클릭 방지
    const audio = audioRef.current;
    if (audio && displayAudioSrc) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch((error) => console.error('오디오 재생 오류:', error));
      }
      setIsPlaying(!isPlaying);
    } else {
      console.warn('오디오 파일 주소가 없습니다.');
    }
  };

  const displayTitle = title || music?.title || '제목 없음';
  const displayArtist = artist || music?.artist || '작성자 미상';
  const displayImageUrl = music?.cover_image || ''; // ⭐️ 이미지 URL
  const displayAudioSrc = music?.audio_file || ''; // ⭐️ 오디오 URL

  const handleDetailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // 상세 페이지로 이동
    navigate(`/post/${id}`);
  };
  // ⭐️ 진행률 계산
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // ⭐️ 시간 포맷 함수 (MM:SS)
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === Infinity) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
            <div className={styles.progressFill} style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <span className={styles.progressText}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* 플레이 버튼 (오른쪽) */}
      <button onClick={handlePlay} className={styles.playButton} disabled={!displayAudioSrc}>
        <span className={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</span>
      </button>

      {displayAudioSrc && <audio ref={audioRef} src={displayAudioSrc} preload="metadata"></audio>}
    </div>
  );
};

export default MusicCard;
