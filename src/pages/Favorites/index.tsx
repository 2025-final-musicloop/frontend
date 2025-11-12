import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Favorites.module.css';
import { getFavoritePosts } from '../../api/posts'; // ✅ posts API 사용
import { getMyFavoriteMusic } from '../../api/mypage';
import type { Post } from '../../api/posts'; // ✅ Post 타입 import
import type { FavoriteMusic } from '../../types/mypage';

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
      
      // ✅ 수정: 새로운 API 사용
      const [postsData, musicData] = await Promise.all([
        getFavoritePosts({ ordering: '-created_at' }),
        getMyFavoriteMusic(1),
      ]);

      // ✅ postsData는 이제 Post[] 배열로 직접 반환됨
      const postItems: FavoriteItem[] = postsData.map((post) => ({
        id: post.id,
        title: post.title,
        type: 'post' as const,
        author: post.author,
        createdAt: post.created_at,
        postId: post.id,
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
      // ✅ TODO: 좋아요 토글 API 사용하여 제거 구현
      alert('제거 기능은 좋아요 토글 API로 구현 예정입니다.');
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
              <div className={styles.emptyIcon}>⭐</div>
              <h3>즐겨찾기가 없습니다</h3>
              <p>마음에 드는 게시물이나 음악에 좋아요를 눌러보세요!</p>
              <button
                onClick={() => navigate('/explore')}
                className={styles.exploreButton}
              >
                둘러보기
              </button>
            </div>
          ) : (
            <div className={styles.favoritesList}>
              {filteredFavorites.map((favorite) => (
                <div
                  key={`${favorite.type}-${favorite.id}`}
                  className={styles.favoriteCard}
                >
                  <div className={styles.favoriteIcon}>
                    {favorite.type === 'music' ? '🎵' : '📝'}
                  </div>
                  <div className={styles.favoriteInfo}>
                    <h3 className={styles.favoriteTitle}>{favorite.title}</h3>
                    <p className={styles.favoriteAuthor}>
                      {favorite.author || '익명'} ·{' '}
                      {favorite.type === 'music' ? '작업물' : '게시물'}
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
