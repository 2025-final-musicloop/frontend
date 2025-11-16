import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './PostDetail.module.css';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { getPostById, getPostDetail, deletePost, togglePostLike, Post } from '../../api/posts';

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
        
        // 상세 정보 조회 시도 (좋아요 정보 포함)
        try {
          const detailData = await getPostDetail(numericId, accessToken || undefined);
          console.log('📋 상세 데이터:', detailData);
          setPostData(detailData);
          setIsLiked(detailData.is_liked || false);
          setLikesCount(detailData.likes_count || detailData.like_count || 0);
        } catch (detailErr) {
          // 실패시 기존 API 사용
          const data = await getPostById(numericId, accessToken || undefined);
          console.log('📋 상세 데이터:', data);
          setPostData(data);
          setLikesCount(data.like_count || 0);
        }
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

  const handleEdit = () => {
    if (!isOwner || !postData) return;
    navigate(`/posts/${postData.postId}/edit`);
  };

  const handleDelete = async () => {
    if (!isOwner || !postData) return;
    if (confirm('정말 이 게시물을 삭제하시겠습니까?')) {
      try {
        if (!accessToken) return;
        await deletePost(postData.postId || postData.id, accessToken);
        alert('삭제되었습니다.');
        navigate('/explore');
      } catch (err) {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  // 🆕 즐겨찾기 토글
  const handleToggleLike = async () => {
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    
    if (!postData) return;

    try {
      const response = await togglePostLike(postData.postId || postData.id, accessToken);
      setIsLiked(response.is_liked);
      setLikesCount(prev => response.is_liked ? prev + 1 : prev - 1);
    } catch (err) {
      console.error('좋아요 토글 실패:', err);
      alert('좋아요 처리에 실패했습니다.');
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
          <div className={styles.titleSection}>
            <h2 className={styles.title}>{postData.title}</h2>
            <p className={styles.artist}>작성자: {authorName}</p>
          </div>
          
          {/* 🆕 통계 섹션 */}
          <div className={styles.statsSection}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>좋아요</span>
              <span className={styles.statValue}>❤️ {likesCount}</span>
            </div>
            {postData.view_count !== undefined && (
              <div className={styles.stat}>
                <span className={styles.statLabel}>조회수</span>
                <span className={styles.statValue}>👁️ {postData.view_count}</span>
              </div>
            )}
            <div className={styles.stat}>
              <span className={styles.statLabel}>작성일</span>
              <span className={styles.statValue}>
                {new Date(postData.created_at).toLocaleDateString('ko-KR')}
              </span>
            </div>
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

        {/* 🆕 즐겨찾기 버튼 (로그인한 모든 사용자) */}
        {user && (
          <div className={styles.actionSection}>
            <button 
              className={`${styles.actionButton} ${isLiked ? styles.liked : ''}`}
              onClick={handleToggleLike}
            >
              <span className={styles.actionIcon}>
                {isLiked ? '❤️' : '🤍'}
              </span>
              {isLiked ? '즐겨찾기 취소' : '즐겨찾기'}
            </button>
          </div>
        )}

        {/* 수정/삭제 버튼 (작성자에게만) */}
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
