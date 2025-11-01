// src/pages/MyWorks/MyWorksPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music } from '../../types/api';
import { MyMusicParams } from '../../types/mypage';
import { getMyMusic } from '../../api/mypage';
import styles from './MyWorksPage.module.css';

const MyWorksPage: React.FC = () => {
  const navigate = useNavigate();
  const [musicList, setMusicList] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [ordering, setOrdering] = useState<'-created_at' | 'created_at'>('-created_at');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // 작업물 로드
  useEffect(() => {
    loadMusic();
  }, [ordering, page]);

  const loadMusic = async () => {
    try {
      setLoading(true);
      setError('');

      const params: MyMusicParams = {
        ordering,
        search: searchQuery || undefined,
        page,
        limit: 12,
      };

      const response = await getMyMusic(params);
      setMusicList(response.results);
      setHasMore(response.next !== null);
      setTotalCount(response.count);
    } catch (err: any) {
      console.error('작업물 로드 실패:', err);
      setError(err.response?.data?.message || '작업물을 불러오는데 실패했습니다.');
      
      // 인증 오류면 로그인 페이지로
      if (err.response?.status === 401) {
        alert('로그인이 필요합니다.');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // 검색
  const handleSearch = () => {
    setPage(1);
    loadMusic();
  };

  // 음악 상세로 이동
  const handleViewMusic = (musicId: number) => {
    navigate(`/music/${musicId}`);
  };

  // 뒤로가기
  const handleBack = () => {
    navigate('/mypage');
  };

  // 재생 시간 포맷
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <header className={styles.header}>
        <button onClick={handleBack} className={styles.backButton}>
          ← 돌아가기
        </button>
        <h1 className={styles.title}>내 작업물</h1>
        <div className={styles.totalCount}>
          총 <strong>{totalCount}</strong>개
        </div>
      </header>

      {/* 컨트롤 */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="작업물 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className={styles.searchInput}
          />
          <button onClick={handleSearch} className={styles.searchButton}>
            🔍 검색
          </button>
        </div>

        <select
          value={ordering}
          onChange={(e) => {
            setOrdering(e.target.value as any);
            setPage(1);
          }}
          className={styles.sortSelect}
        >
          <option value="-created_at">최신순</option>
          <option value="created_at">오래된순</option>
        </select>

        <button 
          onClick={() => navigate('/create-music')}
          className={styles.createButton}
        >
          🎵 새 작업물 업로드
        </button>
      </div>

      {/* 로딩 */}
      {loading && <div className={styles.loading}>로딩 중...</div>}

      {/* 에러 */}
      {error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={loadMusic} className={styles.retryButton}>
            다시 시도
          </button>
        </div>
      )}

      {/* 작업물 목록 */}
      {!loading && !error && (
        <>
          {musicList.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>🎵</div>
              <p>업로드한 작업물이 없습니다.</p>
              <button 
                onClick={() => navigate('/create-music')}
                className={styles.createButton}
              >
                첫 작업물 업로드하기
              </button>
            </div>
          ) : (
            <div className={styles.musicGrid}>
              {musicList.map((music) => (
                <div 
                  key={music.id} 
                  className={styles.musicCard}
                  onClick={() => handleViewMusic(music.id)}
                >
                  <div className={styles.coverImage}>
                    {music.cover_image ? (
                      <img src={music.cover_image} alt={music.title} />
                    ) : (
                      <div className={styles.defaultCover}>
                        <span>🎵</span>
                      </div>
                    )}
                    <div className={styles.playOverlay}>
                      <button className={styles.playButton}>▶</button>
                    </div>
                  </div>

                  <div className={styles.musicInfo}>
                    <h3 className={styles.musicTitle}>{music.title}</h3>
                    <p className={styles.musicArtist}>{music.artist}</p>
                    {music.album && (
                      <p className={styles.musicAlbum}>{music.album}</p>
                    )}
                    <div className={styles.musicMeta}>
                      <span className={styles.duration}>
                        ⏱️ {formatDuration(music.duration)}
                      </span>
                      <span className={styles.date}>
                        {new Date(music.created_at).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 페이지네이션 */}
          {musicList.length > 0 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className={styles.pageButton}
              >
                ← 이전
              </button>
              <span className={styles.pageInfo}>
                <strong>{page}</strong> 페이지
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={!hasMore}
                className={styles.pageButton}
              >
                다음 →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyWorksPage;
