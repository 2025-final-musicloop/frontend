import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyPosts, deletePost } from '../../api/posts'; // ✅ 수정
import type { Post } from '../../api/posts';
import styles from './MyPosts.module.css';

const MyPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<string>('-created_at');

  useEffect(() => {
    fetchMyPosts();
  }, [sortOrder]);

  const fetchMyPosts = async () => {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem('access_token');
      const data = await getMyPosts({ ordering: sortOrder }, accessToken);
      setPosts(data);
    } catch (error) {
      console.error('내 게시물 조회 실패:', error);
      alert('게시물을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId: number) => {
    if (!window.confirm('정말 이 게시물을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      await deletePost(postId, accessToken);
      alert('게시물이 삭제되었습니다.');
      fetchMyPosts(); // 목록 새로고침
    } catch (error) {
      console.error('게시물 삭제 실패:', error);
      alert('게시물 삭제에 실패했습니다.');
    }
  };

  const handleEdit = (postId: number) => {
    navigate(`/post/edit/${postId}`);
  };

  const handleView = (postId: number) => {
    navigate(`/post/${postId}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
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
          <div className={styles.headerRight}>
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className={styles.sortSelect}
            >
              <option value="-created_at">최신순</option>
              <option value="created_at">오래된순</option>
              <option value="title">제목순</option>
              <option value="-title">제목역순</option>
            </select>
            <button
              onClick={() => navigate('/post/create')}
              className={styles.createButton}
            >
              + 새 게시물
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
              <div className={styles.emptyIcon}>📝</div>
              <h3>작성한 게시물이 없습니다</h3>
              <p>첫 번째 게시물을 작성해보세요!</p>
              <button
                onClick={() => navigate('/post/create')}
                className={styles.createButton}
              >
                게시물 작성하기
              </button>
            </div>
          ) : (
            <div className={styles.postsList}>
              {posts.map((post) => (
                <div key={post.id} className={styles.postCard}>
                  {/* 이미지 섹션 */}
                  {post.image && (
                    <div className={styles.postImage}>
                      <img src={post.image} alt={post.title} />
                    </div>
                  )}

                  {/* 내용 섹션 */}
                  <div className={styles.postContent}>
                    <h3 className={styles.postTitle}>{post.title}</h3>
                    <p className={styles.postExcerpt}>
                      {post.content.length > 100
                        ? `${post.content.substring(0, 100)}...`
                        : post.content}
                    </p>

                    {/* 메타 정보 */}
                    <div className={styles.postMeta}>
                      <span className={styles.postDate}>
                        {new Date(post.created_at).toLocaleDateString('ko-KR')}
                      </span>
                      {post.likes_count !== undefined && (
                        <span className={styles.postStats}>
                          ❤️ {post.likes_count}
                        </span>
                      )}
                      {post.comments_count !== undefined && (
                        <span className={styles.postStats}>
                          💬 {post.comments_count}
                        </span>
                      )}
                      {post.view_count !== undefined && (
                        <span className={styles.postStats}>
                          👁️ {post.view_count}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className={styles.postActions}>
                    <button
                      onClick={() => handleView(post.id)}
                      className={styles.viewButton}
                    >
                      보기
                    </button>
                    <button
                      onClick={() => handleEdit(post.id)}
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
    </div>
  );
};

export default MyPosts;
