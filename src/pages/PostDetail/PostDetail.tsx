import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './PostDetail.module.css';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { getPostById, deletePost, togglePostLike, Post } from '../../api/posts';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();

  const [postData, setPostData] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

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
        console.log('📋 상세 데이터:', data);
        console.log('🆔 ID:', data.id);
        console.log('🆔 PostID:', data.postId);
        setPostData(data);
        setIsLiked(data.is_liked || false);
        setLikesCount(data.likes_count || 0);
      } catch (err) {
        console.error('❌ 상세 조회 실패:', err);
        setError('게시글을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, accessToken]);

  const authorName = typeof postData?.author === 'string' 
    ? postData.author 
    : postData?.author?.username || '알 수 없음';

  const isOwner = user?.username === authorName;

  const handleLike = async () => {
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!postData) return;

    try {
      const postIdToUse = postData.postId || postData.id;
      const response = await togglePostLike(postIdToUse, accessToken);
      
      // 좋아요 상태 업데이트
      setIsLiked(response.is_liked);
      setLikesCount(response.likes_count);
      
      console.log('❤️ 좋아요 토글 성공:', response);
    } catch (err) {
      console.error('❌ 좋아요 실패:', err);
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  const handleEdit = () => {
    if (!isOwner || !postData) return;
    const postIdToUse = postData.postId || postData.id;
    console.log('✏️ 수정 ID:', postIdToUse);
    navigate(`/posts/${postIdToUse}/edit`);
  };

  const handleDelete = async () => {
    if (!isOwner || !postData) return;
    if (confirm('정말 이 게시물을 삭제하시겠습니까?')) {
      try {
        if (!accessToken) return;
        const postIdToUse = postData.postId || postData.id;
        console.log('🗑️ 삭제 ID:', postIdToUse);
        await deletePost(postIdToUse, accessToken);
        alert('삭제되었습니다.');
        navigate('/explore');
      } catch (err) {
        console.error('❌ 삭제 실패:', err);
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
        {postData.image && (
          <img 
            src={postData.image} 
            alt={postData.title} 
            style={{ 
              maxWidth: '33%', 
              maxHeight: '250px', 
              objectFit: 'contain', 
              borderRadius: '8px',
              display: 'block',
              margin: '0 auto'
            }} 
          />
        )}
        <div className={styles.infoSection}>
          <h2 className={styles.title}>{postData.title}</h2>
          <p className={styles.artist}>작성자: {authorName}</p>
          
          {/* 좋아요 버튼 추가 */}
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleLike}
              style={{
                background: isLiked 
                  ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)' 
                  : 'white',
                color: isLiked ? 'white' : '#666',
                border: isLiked ? 'none' : '2px solid #e5e7eb',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
                boxShadow: isLiked 
                  ? '0 4px 6px -1px rgba(239, 68, 68, 0.3)' 
                  : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              }}
              onMouseEnter={(e) => {
                if (!isLiked) {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLiked) {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>
                {isLiked ? '❤️' : '🤍'}
              </span>
              <span>{isLiked ? '좋아요 취소' : '좋아요'}</span>
              <span style={{ 
                background: isLiked ? 'rgba(255, 255, 255, 0.3)' : '#f3f4f6',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}>
                {likesCount}
              </span>
            </button>
          </div>
        </div>
        {postData.audio_file ? (
          <audio 
            controls 
            src={postData.audio_file} 
            style={{ width: '100%', marginTop: '1rem' }}
            onError={(e) => {
              console.error('❌ 오디오 로드 실패:', postData.audio_file);
              console.error('❌ 에러 이벤트:', e);
            }}
            onLoadedMetadata={() => {
              console.log('✅ 오디오 메타데이터 로드 성공');
            }}
          >
            Your browser does not support the audio element.
          </audio>
        ) : (
          <p style={{ color: '#999', fontStyle: 'italic' }}>첨부된 오디오 파일이 없습니다.</p>
        )}
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
