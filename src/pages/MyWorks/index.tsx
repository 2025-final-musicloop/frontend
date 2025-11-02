import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyWorks.module.css';
import { getMyWorks, deleteWork } from '../../api/mypage';
import type { Work } from '../../types/mypage';

const MyWorks = () => {
  const navigate = useNavigate();
  const [works, setWorks] = useState<Work[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    try {
      setIsLoading(true);
      const data = await getMyWorks();
      setWorks(data);
    } catch (error) {
      console.error('작업물을 불러오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (workId: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteWork(workId);
        setWorks(works.filter(work => work.id !== workId));
      } catch (error) {
        console.error('삭제 실패:', error);
        alert('삭제에 실패했습니다.');
      }
    }
  };

  const filteredWorks = works
    .filter(work => work.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'latest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          ← 돌아가기
        </button>
        <h1 className={styles.title}>내 작업물</h1>
        <p className={styles.subtitle}>총 {works.length}개</p>
      </div>

      <div className={styles.content}>
        <div className={styles.controls}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="작업물 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <button className={styles.searchButton}>🔍 검색</button>
          </div>

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

          <button
            onClick={() => navigate('/humming')}
            className={styles.createButton}
          >
            🎵 새 작업물 업로드
          </button>
        </div>

        {isLoading ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>작업물을 불러오는 중...</p>
          </div>
        ) : filteredWorks.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              {searchTerm ? '검색 결과가 없습니다.' : '작업물을 불러오는데 실패했습니다.'}
            </p>
            <button onClick={() => navigate('/humming')} className={styles.retryButton}>
              다시 시도
            </button>
          </div>
        ) : (
          <div className={styles.worksList}>
            {filteredWorks.map((work) => (
              <div key={work.id} className={styles.workCard}>
                <div className={styles.workInfo}>
                  <h3 className={styles.workTitle}>{work.title}</h3>
                  <p className={styles.workDate}>
                    {new Date(work.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                <div className={styles.workActions}>
                  <button
                    onClick={() => navigate(`/work/${work.id}`)}
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
        )}
      </div>
    </div>
  );
};

export default MyWorks;
