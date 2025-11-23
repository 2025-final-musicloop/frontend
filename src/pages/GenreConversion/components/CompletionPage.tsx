import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProcessingResult, MusicDetails } from '../../../components/common/ProcessFlow';
import styles from './CompletionPage.module.css';
import { useAuth } from '../../../hooks/useAuth';
import { createMusicPost } from '../../../api/posts';

interface CompletionPageProps {
  onRegenerate: () => void;
  result?: ProcessingResult;
  audioFile?: File;
  details?: MusicDetails;
}

const CompletionPage: React.FC<CompletionPageProps> = ({ onRegenerate, result, audioFile, details }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { accessToken, user } = useAuth();
  const navigate = useNavigate();
  
  const [autoPublishing, setAutoPublishing] = useState(false);
  
  // 중복 실행 방지
  const hasPublished = useRef(false);

  const generateTitle = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    return `생성된 음악 - ${year}.${month}.${day} ${hours}:${minutes}`;
  };

  const generateDescription = (): string => {
    if (details?.genre || details?.mood) {
      const parts: string[] = [];
      if (details.genre) parts.push(`장르: ${details.genre}`);
      if (details.mood) parts.push(`분위기: ${details.mood}`);
      return parts.join(', ');
    }
    return 'AI로 생성된 음악입니다.';
  };

  const handleAutoPublish = async () => {
    // 중복 방지
    if (hasPublished.current) {
      console.log('⚠️ 중복 실행 방지!');
      return;
    }

    if (!accessToken) {
      console.log('⚠️ 로그인되지 않아 자동 등록을 건너뜁니다.');
      return;
    }

    if (!result?.musicUrl && !audioFile) {
      console.error('❌ 오디오 파일이 없어 자동 등록을 건너뜁니다.');
      return;
    }

    try {
      hasPublished.current = true;
      setAutoPublishing(true);
      console.log('🎵 자동 게시글 등록 시작...');

      // 오디오 파일 준비
      let fileToUpload: File | null = null;
      if (audioFile) {
        fileToUpload = audioFile;
      } else if (result?.musicUrl) {
        const resp = await fetch(result.musicUrl);
        const blob = await resp.blob();
        fileToUpload = new File([blob], `music-${Date.now()}.mp3`, { 
          type: blob.type || 'audio/mpeg' 
        });
      }

      if (!fileToUpload) {
        console.error('❌ 업로드할 파일을 생성하지 못했습니다.');
        hasPublished.current = false;
        return;
      }

      const autoTitle = generateTitle();
      const autoDescription = generateDescription();

      console.log('📝 제목:', autoTitle);
      console.log('📝 설명:', autoDescription);

      await createMusicPost(
        {
          title: autoTitle,
          content: autoDescription,
          audioFile: fileToUpload,
          details: (details as unknown as Record<string, unknown>) || undefined,
          author: user?.id,
        },
        accessToken,
      );

      console.log('✅ 게시글 자동 등록 완료!');
      
      // 🎯 Alert만 띄우고 페이지는 유지!
      alert('게시글이 등록되었습니다!');

    } catch (error) {
      console.error('❌ 자동 게시글 등록 실패:', error);
      alert('게시글 등록에 실패했습니다. 다시 시도해주세요.');
      hasPublished.current = false;
    } finally {
      setAutoPublishing(false);
    }
  };

  useEffect(() => {
    if (result?.musicUrl || audioFile) {
      handleAutoPublish();
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
      };
    }
  }, []);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = result?.musicUrl || '';
    link.download = `${generateTitle()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRegenerate = () => {
    onRegenerate();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // 🔄 로딩 화면만 표시
  if (autoPublishing) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}>
            <span className="material-icons" style={{ fontSize: '4rem', color: '#667eea' }}>
              music_note
            </span>
          </div>
          <h2 className={styles.loadingTitle}>🎵 음악을 게시판에 등록하는 중입니다...</h2>
          <p className={styles.loadingText}>잠시만 기다려주세요!</p>
        </div>
      </div>
    );
  }

  // ✅ 메인 화면 (alert 후 여기로 돌아옴!)
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>음악 제작 완료!</h1>
        <p className={styles.description}>음악이 자동으로 게시판에 등록되었습니다</p>
      </div>

      <div className={styles.scrollableContent}>
        {/* 음악 플레이어 */}
        <div className={styles.unifiedMusicPlayer}>
          <div className={styles.playerHeader}>
            <div className={styles.albumArt}>
              <span className="material-icons">music_note</span>
            </div>

            <div className={styles.progressSection}>
              <div className={styles.progressBar}>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className={styles.progressSlider}
                />
                <div className={styles.progressFill} style={{ width: `${progressPercentage}%` }} />
              </div>
              <div className={styles.timeInfo}>
                <span className={styles.currentTime}>{formatTime(currentTime)}</span>
                <span className={styles.totalTime}>{formatTime(duration)}</span>
              </div>
            </div>

            <div className={styles.playerControls}>
              <button className={styles.playButton} onClick={handlePlayPause}>
                <span className="material-icons">{isPlaying ? 'pause' : 'play_arrow'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 자동 생성된 정보 */}
        <div className={styles.formSection}>
          <h3 className={styles.formTitle}>📝 자동 생성된 게시글 정보</h3>

          <div className={styles.inputGroup}>
            <label className={styles.label}>제목</label>
            <div className={styles.displayText}>{generateTitle()}</div>
          </div>

          {details && Object.keys(details).length > 0 && (
            <div className={styles.detailsInfo}>
              <h4>변환 설정</h4>
              <div className={styles.detailsList}>
                {details.genre && <span className={styles.detailItem}>장르: {details.genre}</span>}
                {details.mood && <span className={styles.detailItem}>분위기: {details.mood}</span>}
              </div>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.label}>설명</label>
            <div className={styles.displayText}>{generateDescription()}</div>
          </div>

          <div className={styles.infoBox}>
            <span className="material-icons" style={{ color: '#667eea' }}>info</span>
            <span>게시글은 게시판에서 수정할 수 있습니다.</span>
          </div>
        </div>

        {/* 버튼들 */}
        <div className={styles.actionButtons}>
          <button className={styles.downloadButton} onClick={handleDownload}>
            <span className="material-icons">download</span>
            다운로드
          </button>

          <button className={styles.regenerateButton} onClick={handleRegenerate}>
            <span className="material-icons">refresh</span>
            다시 만들기
          </button>

          {/* 🎯 이 버튼으로 게시판 이동! */}
          <button 
            className={styles.exploreButton}
            onClick={() => navigate('/explore')}
          >
            <span className="material-icons">explore</span>
            게시판으로 이동
          </button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={result?.musicUrl}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
    </div>
  );
};

export default CompletionPage;
