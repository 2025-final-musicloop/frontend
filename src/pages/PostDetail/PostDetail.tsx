import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './PostDetail.module.css';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { getPostById, deletePost, Post } from '../../api/posts';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();

  const [postData, setPostData] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError('게시글 ID가 없습니다.');
        setLoading(false);
        return;
      }
      try {
        const numericId = Number(id);
        if (isNaN(numericId)) {
          setError('유효하지 않은 게시글 ID입니다.');
          setLoading(false);
          return;
        }
        const data = await getPostById(numericId, accessToken || undefined);
        setPostData(data);
      } catch (err) {
        setError('게시글을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, accessToken]);

  // ✅ author 처리 개선
  const authorName = typeof postData?.author === 'string' 
    ? postData.author 
    : postData?.author?.username || '알 수 없음';

  const isOwner = user?.username === authorName;

  const handleEdit = () => {
    if (!isOwner || !postData) return;
    navigate(`/posts/${postData.postId}/edit`);
  };

  const handleDelete = async () => {
    if (!isOwner || !postData) return;
    if (confirm('정말 이 게시물을 삭제하시겠습니까?')) {
      try {
        if (!accessToken) return;
        await deletePost(postData.postId, accessToken);
        alert('삭제되었습니다.');
        navigate('/explore');
      } catch (err) {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  if (loading) return <h1>로딩 중...</h1>;
  if (error) return <h1>{error}</h1>;
  if (!postData) return <h1>게시글을 찾을 수 없습니다.</h1>;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>← 뒤로가기</button>
        <h1 className={styles.pageTitle}>상세보기</h1>
      </div>
      <div className={styles.mainContent}>
        {postData.image && <img src={`http://localhost:8000${postData.image}`} alt={postData.title} style={{ maxWidth: '100%', borderRadius: '8px' }} />}
        <div className={styles.infoSection}>
          <h2 className={styles.title}>{postData.title}</h2>
          <p className={styles.artist}>작성자: {authorName}</p>
        </div>
        {postData.audio_file && <audio controls src={`http://localhost:8000${postData.audio_file}`} style={{ width: '100%' }} />}
        <div className={styles.descriptionSection}>
          <h3 className={styles.sectionTitle}>내용</h3>
          <p className={styles.description}>{postData.content}</p>
        </div>
        {isOwner && (
          <div className={styles.footerActions}>
            <Button variant="secondary" size="md" onClick={handleEdit}>✏️ 수정</Button>
            <Button variant="secondary" size="md" onClick={handleDelete}>🗑️ 삭제</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
