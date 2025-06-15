import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import ExploreHeader from '../../components/ExploreHeader';
import PostCard from '../../components/PostCard';
import styles from './Explore.module.css';
import { AuthContext } from '../../context/AuthContext';
import { getPosts } from '../../api/posts';
import type { Post } from '../../api/posts';

const Explore: React.FC = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🚀 Explore 페이지: 게시글 목록 조회 시작');

        const postsData = await getPosts();
        console.log('📋 Explore 페이지: 받은 게시글 데이터:', postsData);

        setPosts(postsData);
        console.log('✅ Explore 페이지: 게시글 목록 조회 성공:', postsData.length, '개');
      } catch (err: any) {
        console.error('❌ Explore 페이지: 게시글 목록 조회 실패:', err);
        console.error('❌ 에러 상세:', err.response?.data || err.message);

        if (err.response?.status === 404) {
          setError('게시글 목록을 찾을 수 없습니다.');
        } else if (err.response?.status === 401) {
          setError('인증이 필요합니다. 다시 로그인해주세요.');
        } else {
          setError('게시글을 불러오는데 실패했습니다. 다시 시도해주세요.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleMenuClick = (menuId: string) => {
    if (menuId === 'home') {
      navigate('/');
    } else {
      navigate(`/${menuId}`);
    }
  };

  const handleWritePost = () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    navigate('/write-post');
  };

  const handleRetry = () => {
    console.log('🔄 Explore 페이지: 다시 시도');
    window.location.reload();
  };

  return (
    <div className={styles.pageContainer}>
      <Sidebar activeMenu="explore" onMenuClick={handleMenuClick} />
      <main className={styles.mainContent}>
        <ExploreHeader isLoggedIn={!!user} />

        <div className={styles.boardHeader}>
          <h2 className={styles.boardTitle}>게시판</h2>
          <button onClick={handleWritePost} className={styles.writeButton}>
            글 작성
          </button>
        </div>

        <div className={styles.boardContainer}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>게시글을 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <h3>오류</h3>
              <p>{error}</p>
              <button onClick={handleRetry} className={styles.retryButton}>
                다시 시도
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div className={styles.emptyContainer}>
              <h3>게시글이 없습니다</h3>
            </div>
          ) : (
            <div className={styles.postsGrid}>
              {posts.map((post) => (
                <PostCard key={post.postId} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Explore;
