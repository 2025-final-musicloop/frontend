import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyPosts.module.css';
import { getMyPosts, deletePost } from '../../api/mypage';
import type { Post } from '../../types/mypage';

const MyPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const data = await getMyPosts();
      setPosts(data);
    } catch (error) {
      console.error('게시물을 불러오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deletePost(postId);
        setPosts(posts.filter(post => post.id !== postId));
      } catch (error) {
        console.error('삭제 실패:', error);
        alert('삭제에 실패했습니다.');
      }
    }
  };

  const filteredPosts = posts
    .filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()))
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
        <h1 className={styles.title}>내 게시물</h1>
        <p className={styles.subtitle}>총 {posts.length}개</p>
      </div>

      <div className={styles.content}>
        <div className={styles.controls}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="게시물 검색..."
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
            onClick={() => navigate('/board/new')}
            className={styles.createButton}
          >
            ✏️ 새 게시물
          </button>
        </div>

        {isLoading ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>게시물을 불러오는 중...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              {searchTerm ? '검색 결과가 없습니다.' : '게시물을 불러오는데 실패했습니다.'}
            </p>
            <button onClick={() => navigate('/board')} className={styles.retryButton}>
              다시 시도
            </button>
          </div>
        ) : (
          <div className={styles.postsList}>
            {filteredPosts.map((post) => (
              <div key={post.id} className={styles.postCard}>
                <div className={styles.postInfo}>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <p className={styles.postPreview}>{post.content}</p>
                  <div className={styles.postMeta}>
                    <span className={styles.postDate}>
                      {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                    <span className={styles.postStats}>
                      👁 {post.views || 0} · ❤️ {post.likes || 0} · 💬 {post.comments || 0}
                    </span>
                  </div>
                </div>
                <div className={styles.postActions}>
                  <button
                    onClick={() => navigate(`/board/${post.id}`)}
                    className={styles.viewButton}
                  >
                    보기
                  </button>
                  <button
                    onClick={() => navigate(`/board/${post.id}/edit`)}
                    className={styles.editButton}
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
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
export default MyPosts;
