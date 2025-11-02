import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Favorites.module.css';
import { getMyFavoritePosts, getMyFavoriteMusic } from '../../api/mypage';
import type { FavoritePost, FavoriteMusic } from '../../types/mypage';

type FavoriteItem = {
  id: number;
  title: string;
  type: 'post' | 'music';
  author?: string;
  createdAt: string;
  postId?: number;
  musicId?: number;
};

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'posts' | 'music'>('all');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      
      // 게시물과 음악 좋아요를 동시에 가져오기
      const [postsData, musicData] = await Promise.all([
        getMyFavoritePosts(1),
        getMyFavoriteMusic(1),
      ]);

      // 게시물 좋아요를 FavoriteItem 형식으로 변환
      const postItems: FavoriteItem[] = postsData.results.map((item) => ({
        id: item.id,
        title: item.post.title,
        type: 'post' as const,
        author: item.post.author?.username,
        createdAt: item.created_at,
        postId: item.post.id,
      }));

      // 음악 좋아요를 FavoriteItem 형식으로 변환
      const musicItems: FavoriteItem[] = musicData.results.map((item) => ({
        id: item.id,
        title: item.music.title,
        type: 'music' as const,
        author: item.music.author?.username,
        createdAt: item.created_at,
        musicId: item.music.id,
      }));

      // 합치고 최신순으로 정렬
      const allFavorites = [...postItems, ...musicItems].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setFavorites(allFavorites);
    } catch (error) {
      console.error('즐겨찾기를 불러오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (favoriteId: number, type: 'post' | 'music') => {
    if (window.confirm('즐겨찾기에서 제거하시겠습니까?')) {
      // 실제 제거 API는 togglePostLike 등을 사용
      alert('제거 기능은 백엔드 API 완성 후 구현됩니다.');
      // 성공 시:
      // setFavorites(favorites.filter(fav => fav.id !== favoriteId));
    }
  };

  const handleItemClick = (item: FavoriteItem) => {
    if (item.type === 'post' && item.postId) {
      navigate(`/board/${item.postId}`);
    } else if (item.type === 'music' && item.musicId) {
      navigate(`/music/${item.musicId}`);
    }
  };

  const filteredFavorites = favorites.filter((fav) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'posts') return fav.type === 'post';
    if (activeTab === 'music') return fav.type === 'music';
    return true;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          ← 돌아가기
        </button>
        <h1 className={styles.title}>즐겨찾기</h1>
        <p className={styles.subtitle}>총 {favorites.length}개</p>
      </div>

      <div className={styles.content}>
        {/* 탭 메뉴 */}
        <div className={styles.tabs}>
          <button
            onClick={() => setActiveTab('all')}
            className={`${styles.tab} ${activeTab === 'all' ? styles.activeTab : ''}`}
          >
            전체
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`${styles.tab} ${activeTab === 'posts' ? styles.activeTab : ''}`}
          >
            게시물
          </button>
          <button
            onClick={() => setActiveTab('music')}
            className={`${styles.tab} ${activeTab === 'music' ? styles.activeTab : ''}`}
          >
            음악
          </button>
        </div>

        {isLoading ? (
          <div className={styles.emptyState}>
            <div className={styles.iconWrapper}>⭐</div>
            <p className={styles.emptyText}>즐겨찾기를 불러오는 중...</p>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.iconWrapper}>⭐</div>
            <p className={styles.emptyText}>좋아요 목록을 불러오는데 실패했습니다.</p>
            <button onClick={() => navigate('/explore')} className={styles.exploreButton}>
              다시 시도
            </button>
          </div>
        ) : (
          <div className={styles.favoritesList}>
            {filteredFavorites.map((favorite) => (
              <div key={`${favorite.type}-${favorite.id}`} className={styles.favoriteCard}>
                <div className={styles.favoriteIcon}>
                  {favorite.type === 'music' ? '🎵' : '📝'}
                </div>
                <div className={styles.favoriteInfo}>
                  <h3 className={styles.favoriteTitle}>{favorite.title}</h3>
                  <p className={styles.favoriteAuthor}>
                    {favorite.author || '익명'} · {favorite.type === 'music' ? '작업물' : '게시물'}
                  </p>
                  <p className={styles.favoriteDate}>
                    {new Date(favorite.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                <div className={styles.favoriteActions}>
                  <button
                    onClick={() => handleItemClick(favorite)}
                    className={styles.viewButton}
                  >
                    보기
                  </button>
                  <button
                    onClick={() => handleRemove(favorite.id, favorite.type)}
                    className={styles.removeButton}
                  >
                    ❤️ 제거
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

export default Favorites;
