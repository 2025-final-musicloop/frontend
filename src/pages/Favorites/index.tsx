import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Favorites.module.css';
import { getFavorites, removeFavorite } from '../../api/mypage';
import type { Favorite } from '../../types/mypage';

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('즐겨찾기를 불러오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (favoriteId: string) => {
    if (window.confirm('즐겨찾기에서 제거하시겠습니까?')) {
      try {
        await removeFavorite(favoriteId);
        setFavorites(favorites.filter(fav => fav.id !== favoriteId));
      } catch (error) {
        console.error('제거 실패:', error);
        alert('제거에 실패했습니다.');
      }
    }
  };

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
        {isLoading ? (
          <div className={styles.emptyState}>
            <div className={styles.iconWrapper}>⭐</div>
            <p className={styles.emptyText}>즐겨찾기를 불러오는 중...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.iconWrapper}>⭐</div>
            <p className={styles.emptyText}>좋아요 목록을 불러오는데 실패했습니다.</p>
            <button onClick={() => navigate('/explore')} className={styles.exploreButton}>
              다시 시도
            </button>
          </div>
        ) : (
          <div className={styles.favoritesList}>
            {favorites.map((favorite) => (
              <div key={favorite.id} className={styles.favoriteCard}>
                <div className={styles.favoriteIcon}>
                  {favorite.type === 'work' ? '🎵' : '📝'}
                </div>
                <div className={styles.favoriteInfo}>
                  <h3 className={styles.favoriteTitle}>{favorite.title}</h3>
                  <p className={styles.favoriteAuthor}>
                    {favorite.author || '익명'} · {favorite.type === 'work' ? '작업물' : '게시물'}
                  </p>
                  <p className={styles.favoriteDate}>
                    {new Date(favorite.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                <div className={styles.favoriteActions}>
                  <button
                    onClick={() => navigate(`/${favorite.type}/${favorite.id}`)}
                    className={styles.viewButton}
                  >
                    보기
                  </button>
                  <button
                    onClick={() => handleRemove(favorite.id)}
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
