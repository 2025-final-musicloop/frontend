import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyWorks.module.css';
import { getMyMusic } from '../../api/mypage';  // ✅ 여기!
import type { Music } from '../../types/api';

const MyWorks = () => {
  const navigate = useNavigate();
  const [works, setWorks] = useState<Music[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchWorks();
  }, [sortOrder, currentPage]);

  const fetchWorks = async () => {
    try {
      setIsLoading(true);
      const ordering = sortOrder === 'latest' ? '-created_at' : 'created_at';
      const data = await getMyMusic({
        ordering,
        page: currentPage,
        limit: 10,
      });
      setWorks(data.results);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (error) {
      console.error('작업물을 불러오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const ordering = sortOrder === 'latest' ? '-created_at' : 'created_at';
      const data = await getMyMusic({
        search: searchTerm,
        ordering,
        page: 1,
        limit: 10,
      });
      setWorks(data.results);
      setTotalPages(Math.ceil(data.count / 10));
      setCurrentPage(1);
    } catch (error) {
      console.error('검색 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (workId: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      alert('삭제 기능은 백엔드 API 완성 후 구현됩니다.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <div className={styles.boardHeader}>
          <div className={styles.headerLeft}>
            <button onClick={() => navigate(-1)} className={styles.backButton}>
              ← 돌아가기
            </button>
            <div className={styles.titleSection}>
              <h1 className={styles.boardTitle}>내 작업물</h1>
              <p className={styles.subtitle}>총 {works.length}개의 작업물</p>
            </div>
          </div>
        </div>

        <div className={styles.controls}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="작업물 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className={styles.searchInput}
            />
            <button onClick={handleSearch} className={styles.searchButton}>
              🔍 검색
            </button>
          </div>

          <div className={styles.controlsRow}>
            <div className={styles.sortButtons}>
              <button
                onClick={() => setSortOrder('latest')}
                className={`${styles.sortButton} ${sortOrder === 'latest' ? styles.active : ''}`}
              >
                최신순
              </button>
              <button
                onClick={() => setSortOrder('oldest')}
                className={`${styles.sortButton} ${sortOrder === 'oldest' ? styles.active : ''}`}
              >
                오래된순
              </button>
            </div>
          </div>
        </div>

        <div className={styles.boardContainer}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>작업물을 불러오는 중...</p>
            </div>
          ) : works.length === 0 ? (
            <div className={styles.emptyContainer}>
              <h3>작업물이 없습니다</h3>
              <p>
                {searchTerm
                  ? '검색 결과가 없습니다.'
                  : '첫 번째 작업물을 만들어보세요!'}
              </p>
            </div>
          ) : (
            <>
              <div className={styles.postsList}>
                {works.map((work) => (
                  <div key={work.id} className={styles.workCard}>
                    <div className={styles.workInfo}>
                      <h3 className={styles.workTitle}>{work.title}</h3>
                      <p className={styles.workPreview}>{work.content}</p>
                      <div className={styles.workMeta}>
                        <span className={styles.workDate}>
                          {new Date(work.created_at).toLocaleDateString('ko-KR')}
                        </span>
                        {work.genre && <span className={styles.workGenre}>🎵 {work.genre}</span>}
                      </div>
                    </div>
                    <div className={styles.workActions}>
                      <button
                        onClick={() => navigate(`/music/${work.id}`)}
                        className={styles.viewButton}
                      >
                        보기
                      </button>
                      <button
                        onClick={() => handleDelete(work.id)}
                        className={styles.deleteButton}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={styles.pageButton}
                  >
                    이전
                  </button>
                  <span className={styles.pageInfo}>
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={styles.pageButton}
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyWorks;
