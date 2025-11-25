import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyPosts.module.css';
import { getMyPosts } from '../../api/mypage'; // 🔧 여기 수정!
import { deletePost } from '../../api/posts'; // 🔧 deletePost는 posts에서
import type { Post } from '../../types/api';

const MyPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [sortOrder, currentPage]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const ordering = sortOrder === 'latest' ? '-created_at' : 'created_at';
      const data = await getMyPosts({
        ordering,
        page: currentPage,
        limit: 10,
      });
      setPosts(data.results);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (error) {
      console.error('게시물을 불러오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const ordering = sortOrder === 'latest' ? '-created_at' : 'created_at';
      const data = await getMyPosts({
        search: searchTerm,
        ordering,
        page: 1,
        limit: 10,
      });
      setPosts(data.results);
      setTotalPages(Math.ceil(data.count / 10));
      setCurrentPage(1);
    } catch (error) {
      console.error('검색 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          alert('로그인이 필요합니다.');
          return;
        }
        await deletePost(postId, accessToken);
        alert('게시물이 삭제되었습니다.');
        fetchPosts(); // 목록 새로고침
      } catch (error) {
        console.error('삭제 실패:', error);
        alert('게시물 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        {/* 헤더 */}
        <div className={styles.boardHeader}>
          <div className={styles.headerLeft}>
            <button onClick={() => navigate(-1)} className={styles.backButton}>
              ← 돌아가기
            </button>
            <div className={styles.titleSection}>
              <h1 className={styles.boardTitle}>내 게시물</h1>
              <p className={styles.subtitle}>총 {posts.length}개의 게시물</p>
            </div>
          </div>
        </div>

        {/* 컨트롤 영역 */}
        <div className={styles.controls}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="게시물 검색..."
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

            <button onClick={() => navigate('/write-post')} className={styles.createButton}>
              ✏️ 새 게시물 작성
            </button>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className={styles.boardContainer}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>게시물을 불러오는 중...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className={styles.emptyContainer}>
              <h3>게시물이 없습니다</h3>
              <p>{searchTerm ? '검색 결과가 없습니다.' : '첫 번째 게시물을 작성해보세요!'}</p>
              <button onClick={() => navigate('/write-post')} className={styles.retryButton}>
                게시물 작성하기
              </button>
            </div>
          ) : (
            <>
              <div className={styles.postsList}>
                {posts.map((post) => (
                  <div key={post.id} className={styles.postCard}>
                    <div className={styles.postInfo}>
                      <h3 className={styles.postTitle}>{post.title}</h3>
                      <p className={styles.postPreview}>{post.content}</p>
                      <div className={styles.postMeta}>
                        <span className={styles.postDate}>{new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
                        <span className={styles.postStats}>
                          👁 {post.view_count || 0} · ❤️ {post.like_count || 0}
                        </span>
                      </div>
                    </div>
                    <div className={styles.postActions}>
                      <button onClick={() => navigate(`/post/${post.id}`)} className={styles.viewButton}>
                        보기
                      </button>
                      <button onClick={() => navigate(`/posts/${post.id}/edit`)} className={styles.editButton}>
                        수정
                      </button>
                      <button onClick={() => handleDelete(post.id)} className={styles.deleteButton}>
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 페이지네이션 */}
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

export default MyPosts;
