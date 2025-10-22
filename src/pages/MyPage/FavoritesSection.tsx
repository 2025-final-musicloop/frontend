import { useState, useEffect } from 'react';
import { Favorite } from '../../types/mypage';
import { getFavorites, toggleFavorite } from '../../api/mypage';
import styles from './MyPage.module.css';

const FavoritesSection = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const params = searchTerm ? { search: searchTerm } : undefined;
      const response = await getFavorites(params);
      setFavorites(response.results || []);
    } catch (err: any) {
      setMessage('좋아요 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadFavorites();
  };

  const handleToggleFavorite = async (loopId: number, title: string) => {
    if (!confirm(`"${title}" 좋아요를 취소하시겠습니까?`)) return;

    try {
      setMessage('');
      await toggleFavorite(loopId);
      setMessage('좋아요가 취소되었습니다.');
      loadFavorites();
    } catch (err: any) {
      setMessage(err.response?.data?.error || '좋아요 취소에 실패했습니다.');
    }
  };

  return (
    <div>
      {message && (
        <div className={`${styles.message} ${message.includes('실패') ? styles.error : styles.success}`}>
          {message}
        </div>
      )}

      {/* 검색 */}
      <div className={styles.controls}>
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="루프 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>검색</button>
        </div>
      </div>

      {/* 좋아요 목록 */}
      {loading ? (
        <div className={styles.loading}>로딩 중...</div>
      ) : favorites.length === 0 ? (
        <div className={styles.empty}>
          <p>좋아요한 루프가 없습니다.</p>
          <p>마음에 드는 루프를 찾아보세요! 🎵</p>
        </div>
      ) : (
        <div className={styles.favoritesGrid}>
          {favorites.map((favorite) => (
            <div key={favorite.id} className={styles.favoriteCard}>
              <div className={styles.loopThumbnail}>
                {favorite.loop.thumbnail ? (
                  <img src={favorite.loop.thumbnail} alt={favorite.loop.title} />
                ) : (
                  <div className={styles.thumbnailPlaceholder}>🎵</div>
                )}
              </div>
              <div className={styles.loopInfo}>
                <h3>{favorite.loop.title}</h3>
                {favorite.loop.description && <p>{favorite.loop.description}</p>}
                <div className={styles.loopAuthor}>
                  by {favorite.loop.user_nickname || favorite.loop.user_email}
                </div>
                <div className={styles.loopMeta}>
                  {favorite.loop.genre && (
                    <span>{favorite.loop.genre}</span>
                  )}
                  {favorite.loop.bpm && (
                    <span>{favorite.loop.bpm} BPM</span>
                  )}
                </div>
                <div className={styles.loopStats}>
                  <span>▶ {favorite.loop.play_count}</span>
                  <span>❤ {favorite.loop.favorites_count}</span>
                </div>
                <div className={styles.favoriteDate}>
                  {new Date(favorite.created_at).toLocaleDateString('ko-KR')}에 좋아요
                </div>
              </div>
              <div className={styles.loopActions}>
                <button
                  onClick={() =>
                    handleToggleFavorite(favorite.loop.id, favorite.loop.title)
                  }
                  className={styles.unlike}
                >
                  💔 좋아요 취소
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesSection;
