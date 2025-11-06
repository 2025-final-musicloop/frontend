import React, { useState, useRef, useEffect } from 'react';
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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const { accessToken, user } = useAuth();
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    // 다운로드 로직 구현
    const link = document.createElement('a');
    link.href = result?.musicUrl || '';
    link.download = `${title || '허밍음악'}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePublish = async () => {
    try {
      setError(null);
      if (!accessToken) {
        setError('로그인이 필요합니다.');
        alert('로그인이 필요합니다.');
        return;
      }

      // 업로드할 파일 소스 결정: 우선순위 audioFile prop -> result.musicBlobUrl -> result.musicUrl fetch
      let fileToUpload: File | null = null;
      if (audioFile) {
        fileToUpload = audioFile;
      } else if (result?.musicUrl) {
        const resp = await fetch(result.musicUrl);
        const blob = await resp.blob();
        fileToUpload = new File([blob], `${title || 'huming-music'}.mp3`, { type: blob.type || 'audio/mpeg' });
      }

      if (!fileToUpload) {
        setError('업로드할 오디오 파일을 찾을 수 없습니다.');
        alert('업로드할 오디오 파일을 찾을 수 없습니다.');
        return;
      }

      if (!title.trim()) {
        alert('제목을 입력해주세요.');
        return;
      }

      setPublishing(true);
      await createMusicPost(
        {
          title: title.trim(),
          content: description.trim(),
          audioFile: fileToUpload,
          details: (details as unknown as Record<string, unknown>) || undefined,
          author: user?.id,
        },
        accessToken,
      );
      alert('게시글이 등록되었습니다.');
    } catch (e) {
      console.error(e);
      setError('게시글 등록에 실패했습니다.');
      alert('게시글 등록에 실패했습니다.');
    } finally {
      setPublishing(false);
    }
  };

  const handleRegenerate = () => {
    onRegenerate();
  };

  // 임시 테스트 함수들
  const handleTestRegenerate = () => {
    onRegenerate();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>음악 제작 완료!</h1>
      </div>

      <div className={styles.scrollableContent}>
        {/* 통합된 뮤직 플레이어 */}
        <div className={styles.unifiedMusicPlayer}>
          <div className={styles.playerHeader}>
            <div className={styles.albumArt}>
              <span className="material-icons">music_note</span>
            </div>

            {/* 진행 바 섹션 */}
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

        <div className={styles.formSection}>
          <h3 className={styles.formTitle}>음악 정보 입력</h3>

          <div className={styles.inputGroup}>
            <label htmlFor="title" className={styles.label}>
              제목
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="음악 제목을 입력하세요"
              className={styles.input}
            />
          </div>

          {details && Object.keys(details).length > 0 && (
            <div className={styles.detailsInfo}>
              <h4>사용된 설정</h4>
              <div className={styles.detailsList}>
                {details.genre && <span className={styles.detailItem}>장르: {details.genre}</span>}
                {details.instrument && <span className={styles.detailItem}>악기: {details.instrument}</span>}
                {details.mood && <span className={styles.detailItem}>분위기: {details.mood}</span>}
              </div>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="description" className={styles.label}>
              설명
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="음악에 대한 설명을 입력하세요"
              className={styles.textarea}
              rows={3}
            />
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.downloadButton} onClick={handleDownload}>
            <span className="material-icons">download</span>
            다운로드
          </button>

          <button className={styles.regenerateButton} onClick={handleRegenerate}>
            <span className="material-icons">refresh</span>
            다시 만들기
          </button>

          <button className={styles.publishButton} onClick={handlePublish} disabled={publishing}>
            <span className="material-icons">publish</span>
            {publishing ? '등록 중...' : '게시글로 등록하기'}
          </button>
        </div>
      </div>

      {/* 고정된 테스트 버튼들 */}
      <div className={styles.fixedTestButtons}>
        <button className={styles.testButton} onClick={handleTestRegenerate}>
          다시 만들기
        </button>
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
