import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './PostDetail.module.css';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

interface PostDetailData {
  id: string;
  title: string;
  artist: string;
  description: string;
  genre: string;
  bpm: number;
  duration: string;
  key: string;
  tags: string[];
  coverImage: string;
  audioUrl: string;
  createdAt: string;
  likes: number;
  plays: number;
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // 임시 데이터
  const [postData] = useState<PostDetailData>({
    id: id || '1',
    title: '테스트 제목',
    artist: '테스트 가수',
    description: '가나다라',
    genre: 'Ballade',
    bpm: 99,
    duration: '3:45',
    key: 'C major',
    tags: ['발라드', '피아노', '감성'],
    coverImage: '',
    audioUrl: '',
    createdAt: '2024-01-15',
    likes: 128,
    plays: 1542,
  });

  // TODO: 실제 API 데이터에 authorId(또는 ownerId)를 포함해 비교하도록 교체 필요
  const postOwnerId = 1;
  const isOwner = user?.id === postOwnerId;

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    // 실제 오디오 재생 로직은 나중에 구현
    console.log('Playing:', postData.title);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // 좋아요 API 호출은 나중에 구현
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    if (!isOwner) return;
    navigate(`/posts/${postData.id}/edit`);
  };

  const handleDelete = () => {
    if (!isOwner) return;
    const ok = confirm('정말 이 게시물을 삭제하시겠습니까?');
    if (!ok) return;
    // TODO: 삭제 API 연동 후 라우팅
    alert('삭제가 완료되었습니다.');
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.pageContainer}>
      {/* 헤더 */}
      <div className={styles.header}>
        <button onClick={handleBack} className={styles.backButton}>
          ← 뒤로가기
        </button>
        <h1 className={styles.pageTitle}>곡 상세보기</h1>
      </div>

      {/* 메인 콘텐츠 */}
      <div className={styles.mainContent}>
        {/* 앨범 커버 및 재생 컨트롤 */}
        <div className={styles.coverSection}>
          <div className={styles.coverContainer}>
            {postData.coverImage ? (
              <img src={postData.coverImage} alt={postData.title} className={styles.coverImage} />
            ) : (
              <div className={styles.coverPlaceholder}>
                <span className={styles.coverText}>{postData.title.charAt(0)}</span>
              </div>
            )}
          </div>

          <div className={styles.playControls}>
            <button onClick={handlePlay} className={styles.playButton}>
              <span className={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</span>
            </button>
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${(currentTime / 225) * 100}%` }}></div>
              </div>
              <span className={styles.progressText}>
                {formatTime(currentTime)} / {postData.duration}
              </span>
            </div>
          </div>
        </div>

        {/* 곡 정보 */}
        <div className={styles.infoSection}>
          <div className={styles.titleSection}>
            <h2 className={styles.title}>{postData.title}</h2>
            <p className={styles.artist}>{postData.artist}</p>
          </div>

          <div className={styles.statsSection}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>재생</span>
              <span className={styles.statValue}>{postData.plays.toLocaleString()}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>좋아요</span>
              <span className={styles.statValue}>{postData.likes.toLocaleString()}</span>
            </div>
          </div>

          {/* 액션 버튼 (곡 정보 블록 내부로 이동) */}
          <div className={styles.actionSection}>
            <Button variant="primary" size="md" onClick={handleLike} className={styles.actionButton}>
              <span className={styles.actionIcon}>{isLiked ? '❤️' : '🤍'}</span>
              좋아요
            </Button>
            <Button variant="primary" size="md" className={styles.actionButton}>
              <span className={styles.actionIcon}>📤</span>
              공유
            </Button>
          </div>
        </div>

        {/* 상세 정보 */}
        <div className={styles.detailsSection}>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>장르</span>
              <span className={styles.detailValue}>{postData.genre}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>BPM</span>
              <span className={styles.detailValue}>{postData.bpm}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>길이</span>
              <span className={styles.detailValue}>{postData.duration}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>조성</span>
              <span className={styles.detailValue}>{postData.key}</span>
            </div>
          </div>

          <div className={styles.tagsSection}>
            <span className={styles.tagsLabel}>태그</span>
            <div className={styles.tagsContainer}>
              {postData.tags.map((tag, index) => (
                <span key={index} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 설명 */}
        <div className={styles.descriptionSection}>
          <h3 className={styles.sectionTitle}>곡 설명</h3>
          <p className={styles.description}>{postData.description}</p>
        </div>

        {/* 하단 관리 버튼 (소유자만 활성화) */}
        <div className={styles.footerActions}>
          <Button
            variant="secondary"
            size="md"
            onClick={handleEdit}
            disabled={!isOwner}
            className={styles.manageButton}
          >
            ✏️ 수정
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={handleDelete}
            disabled={!isOwner}
            className={styles.manageButton}
          >
            🗑️ 삭제
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
