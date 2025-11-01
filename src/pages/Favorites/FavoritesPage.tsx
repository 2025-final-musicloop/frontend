// src/pages/Favorites/FavoritesPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FavoritePost } from '../../types/mypage';
import { getMyFavoritePosts, togglePostLike } from '../../api/mypage';
import styles from './FavoritesPage.module.css';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoritePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // 좋아요 목록 로드
  useEffect(() => {
    loadFavorites();
  }, [page]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await getMyFavoritePosts(page);
      setFavorites(response.results);
      setHasMore(response.next !== null);
      setTotalCount(response.count);
    } catch (err: any) {
      console.error('좋아요 목록 로드 실패:', err);
      setError(err.response?.data?.message || '좋아요 목록을 불러오는데 실패했습니다.');
      
      // 인증 오류면 로그인 페이지로
      if (err.response?.status === 401) {
        alert('로그인이 필요합니다.');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // 좋아요 취소
  const handleUnlike = async (postId: number) => {
    if (!window.confirm('좋아요를 취소하시겠습니까?')) return;

    try {
      await togglePostLike(postId);
      // 목록 새로고침
      loadFavorites();
    } catch (err: any) {
      console.error('좋아요 취소 실패:', err);
      alert(err.response?.data?.message || '좋아요 취소에 실패했습니다.');
    }
  };

  // 게시물 상세로 이동
  const handleViewPost = (postId: number) => {
    navigate(`/posts/${postId}`);
  };

  // 뒤로가기
  const handleBack = () => {
    navigate('/mypage');
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <header className={styles.header}>
        <button onClick={handleBack} className={styles.backButton}>
          ← 돌아가기
        </button>
        <h1 className={styles.title}>즐겨찾기</h1>
        <div className={styles.totalCount}>
          총 <strong>{totalCount}</strong>개
        </div>
      </header>

      {/* 로딩 */}
      {loading && <div className={styles.loading}>로딩 중...</div>}

      {/* 에러 */}
      {error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={loadFavorites} className={styles.retryButton}>
            다시 시도
          </button>
        </div>
      )}

      {/* 좋아요 목록 */}
      {!loading && !error && (
        <>
          {favorites.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>❤️</div>
              <p>좋아요한 게시물이 없습니다.</p>
              <button 
                onClick={() => navigate('/explore')}
                className={styles.exploreButton}
              >
                게시물 둘러보기
              </button>
            </div>
          ) : (
            <div className={styles.favoritesList}>
              {favorites.map((favorite) => (
                <div key={favorite.id} className={styles.favoriteCard}>
                  <div className={styles.postHeader}>
                    <div className={styles.titleSection}>
                      <h3 
                        className={styles.postTitle}
                        onClick={() => handleViewPost(favorite.post.id)}
                      >
                        {favorite.post.title}
                      </h3>
                      <p className={styles.postAuthor}>
                        작성자: <strong>{favorite.post.author.username}</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => handleUnlike(favorite.post.id)}
                      className={styles.unlikeButton}
                      title="좋아요 취소"
                    >
                      ❤️
                    </button>
                  </div>

                  <p className={styles.postContent}>
                    {favorite.post.content.length > 200
                      ? `${favorite.post.content.substring(0, 200)}...`
                      : favorite.post.content}
                  </p>

                  <div className={styles.postFooter}>
                    <div className={styles.postStats}>
                      <span title="좋아요">❤️ {favorite.post.likes_count || 0}</span>
                      <span title="댓글">💬 {favorite.post.comments_count || 0}</span>
                    </div>
                    <div className={styles.dates}>
                      <span className={styles.postDate}>
                        작성: {new Date(favorite.post.created_at).toLocaleDateString('ko-KR')}
                      </span>
                      <span className={styles.favoriteDate}>
                        좋아요: {new Date(favorite.created_at).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 페이지네이션 */}
          {favorites.length > 0 && (
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

export default FavoritesPage;
