import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import BackButton from '../../components/BackButton';
import { getPost } from '../../api/posts';
import type { Post } from '../../api/posts';
import styles from './PostDetail.module.css';

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      try {
        setLoading(true);
        const postData = await getPost(parseInt(postId));
        setPost(postData);
        setError(null);
      } catch (err: any) {
        console.error('게시글 조회 실패:', err);
        if (err.response?.status === 404) {
          setError('게시글을 찾을 수 없습니다.');
        } else {
          setError('게시글을 불러오는데 실패했습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleMenuClick = (menuId: string) => {
    if (menuId === 'home') {
      navigate('/');
    } else {
      navigate(`/${menuId}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <Sidebar activeMenu="explore" onMenuClick={handleMenuClick} />
        <main className={styles.mainContent}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>게시글을 불러오는 중...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styles.pageContainer}>
        <Sidebar activeMenu="explore" onMenuClick={handleMenuClick} />
        <main className={styles.mainContent}>
          <div className={styles.errorContainer}>
            <h2>오류</h2>
            <p>{error || '알 수 없는 오류가 발생했습니다.'}</p>
            <BackButton />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Sidebar activeMenu="explore" onMenuClick={handleMenuClick} />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <BackButton />
          <h1 className={styles.title}>게시글</h1>
        </div>

        <div className={styles.postContainer}>
          <div className={styles.imageSection}>
            <img src="/ex.jpg" alt="게시글 이미지" className={styles.postImage} />
          </div>

          <div className={styles.postHeader}>
            <h2 className={styles.postTitle}>{post.title}</h2>
            <div className={styles.postMeta}>
              <span className={styles.postDate}>{formatDate(post.createdAt)}</span>
              <span className={styles.postId}>#{post.postId}</span>
            </div>
          </div>

          <div className={styles.postContent}>
            <p className={styles.postDescription}>{post.description}</p>
          </div>

          {post.audioUrl && (
            <div className={styles.audioSection}>
              <h3>오디오</h3>
              <audio controls className={styles.audioPlayer}>
                <source src={post.audioUrl} type="audio/mpeg" />
                브라우저가 오디오를 지원하지 않습니다.
              </audio>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PostDetail;
