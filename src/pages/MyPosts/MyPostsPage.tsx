// src/pages/MyPosts/MyPostsPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post } from '../../types/api';
import { MyPostsParams } from '../../types/mypage';
import { getMyPosts } from '../../api/mypage';
import { deletePost } from '../../api/posts';
import styles from './MyPostsPage.module.css';

const MyPostsPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [ordering, setOrdering] = useState<'-created_at' | 'created_at' | '-likes_count' | 'likes_count'>('-created_at');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // 게시물 로드
  useEffect(() => {
    loadPosts();
  }, [ordering, page]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError('');

      const params: MyPostsParams = {
        ordering,
        search: searchQuery || undefined,
        page,
        limit: 10,
      };

      const response = await getMyPosts(params);
      setPosts(response.results);
      setHasMore(response.next !== null);
      setTotalCount(response.count);
    } catch (err: any) {
      console.error('게시물 로드 실패:', err);
      setError(err.response?.data?.message || '게시물을 불러오는데 실패했습니다.');
      
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
    loadPosts();
  };

  // 게시물 삭제
  const handleDelete = async (postId: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      const token = localStorage.getItem('accessToken') || '';
      await deletePost(postId, token);
      
      // 목록 새로고침
      loadPosts();
      alert('게시물이 삭제되었습니다.');
    } catch (err: any) {
      console.error('삭제 실패:', err);
      alert(err.response?.data?.message || '게시물 삭제에 실패했습니다.');
    }
  };

  // 게시물 상세로 이동
  const handleViewPost = (postId: number) => {
    navigate(`/posts/${postId}`);
  };

  // 게시물 수정으로 이동
  const handleEditPost = (postId: number) => {
    navigate(`/posts/${postId}/edit`);
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
        <h1 className={styles.title}>내 게시물</h1>
        <div className={styles.totalCount}>
          총 <strong>{totalCount}</strong>개
        </div>
      </header>

      {/* 컨트롤 */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="게시물 검색..."
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
          <option value="-likes_count">좋아요 많은순</option>
          <option value="likes_count">좋아요 적은순</option>
        </select>

        <button 
          onClick={() => navigate('/posts/create')}
          className={styles.createButton}
        >
          ✏️ 새 게시물
        </button>
      </div>

      {/* 로딩 */}
      {loading && <div className={styles.loading}>로딩 중...</div>}

      {/* 에러 */}
      {error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={loadPosts} className={styles.retryButton}>
            다시 시도
          </button>
        </div>
      )}

      {/* 게시물 목록 */}
      {!loading && !error && (
        <>
          {posts.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>📝</div>
              <p>작성한 게시물이 없습니다.</p>
              <button 
                onClick={() => navigate('/posts/create')}
                className={styles.createButton}
              >
                첫 게시물 작성하기
              </button>
            </div>
          ) : (
            <div className={styles.postsList}>
              {posts.map((post) => (
                <div key={post.id} className={styles.postCard}>
                  <div className={styles.postHeader}>
                    <h3 
                      className={styles.postTitle}
                      onClick={() => handleViewPost(post.id)}
                    >
                      {post.title}
                    </h3>
                    <div className={styles.postActions}>
                      <button
                        onClick={() => handleEditPost(post.id)}
                        className={styles.editButton}
                        title="수정"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className={styles.deleteButton}
                        title="삭제"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <p className={styles.postContent}>
                    {post.content.length > 200
                      ? `${post.content.substring(0, 200)}...`
                      : post.content}
                  </p>

                  <div className={styles.postFooter}>
                    <span className={styles.postDate}>
                      {new Date(post.created_at).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <div className={styles.postStats}>
                      <span title="좋아요">❤️ {post.likes_count || 0}</span>
                      <span title="댓글">💬 {post.comments_count || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 페이지네이션 */}
          {posts.length > 0 && (
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

export default MyPostsPage;
