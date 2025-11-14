import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Favorites.module.css';
import { getMyFavoritePosts, getMyFavoriteMusic } from '../../api/mypage';  // 🔧 여기 수정!
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

      const [postsData, musicData] = await Promise.all([
        getMyFavoritePosts(1),
        getMyFavoriteMusic(1),
      ]);

      const postItems: FavoriteItem[] = postsData.results.map((item) => ({
        id: item.id,
        title: item.post.title,
        type: 'post' as const,
        author: item.post.author?.username,
        createdAt: item.created_at,
        postId: item.post.id,
      }));

      const musicItems: FavoriteItem[] = musicData.results.map((item) => ({
        id: item.id,
        title: item.music.title,
        type: 'music' as const,
        author: item.music.author?.username,
        createdAt: item.created_at,
        musicId: item.music.id,
      }));

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
      alert('제거 기능은 백엔드 API 완성 후 구현됩니다.');
    }
  };

  const handleItemClick = (item: FavoriteItem) => {
    if (item.type === 'post' && item.postId) {
      navigate(`/post/${item.postId}`);
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
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        {/* 헤더 */}
        <div className={styles.boardHeader}>
          <div className={styles.headerLeft}>
            <button onClick={() => navigate(-1)} className={styles.backButton}>
              ← 돌아가기
            </button>
            <div className={styles.titleSection}>
              <h1 className={styles.boardTitle}>즐겨찾기</h1>
              <p className={styles.subtitle}>총 {favorites.length}개의 즐겨찾기</p>
            </div>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button
              onClick={() => setActiveTab('all')}
              className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
            >
              전체
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`${styles.tab} ${activeTab === 'posts' ? styles.active : ''}`}
            >
              게시물
            </button>
            <button
              onClick={() => setActiveTab('music')}
              className={`${styles.tab} ${activeTab === 'music' ? styles.active : ''}`}
            >
              음악
            </button>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className={styles.boardContainer}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>즐겨찾기를 불러오는 중...</p>
            </div>
          ) : filteredFavorites.length === 0 ? (
            <div className={styles.emptyContainer}>
              <h3>즐겨찾기가 없습니다</h3>
              <p>마음에 드는 콘텐츠를 즐겨찾기에 추가해보세요!</p>
            </div>
          ) : (
            <div className={styles.favoritesList}>
              {filteredFavorites.map((item) => (
                <div key={`${item.type}-${item.id}`} className={styles.favoriteCard}>
                  <div className={styles.favoriteInfo}>
                    <div className={styles.typeLabel}>
                      {item.type === 'post' ? '📝 게시물' : '🎵 음악'}
                    </div>
                    <h3 className={styles.favoriteTitle}>{item.title}</h3>
                    {item.author && (
                      <p className={styles.favoriteAuthor}>작성자: {item.author}</p>
                    )}
                    <p className={styles.favoriteDate}>
                      {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <div className={styles.favoriteActions}>
                    <button
                      onClick={() => handleItemClick(item)}
                      className={styles.viewButton}
                    >
                      보기
                    </button>
                    <button
                      onClick={() => handleRemove(item.id, item.type)}
                      className={styles.removeButton}
                    >
                      제거
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

export default Favorites;
