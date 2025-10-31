import { useState, useEffect } from 'react';
import { UserProfile, LoopStatistics } from '../../types/mypage';
import { getMyProfile, getLoopStatistics } from '../../api/mypage';
import ProfileSection from './ProfileSection';
import MyLoopsSection from './MyLoopsSection';
import FavoritesSection from './FavoritesSection';
import styles from './MyPage.module.css';

type TabType = 'profile' | 'loops' | 'favorites';

const MyPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [statistics, setStatistics] = useState<LoopStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // 초기 데이터 로드
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [profileData, statsData] = await Promise.all([
        getMyProfile(),
        getLoopStatistics(),
      ]);
      setProfile(profileData);
      setStatistics(statsData);
    } catch (err: any) {
      setError(err.response?.data?.error || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 프로필 업데이트 콜백
  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={loadInitialData}>다시 시도</button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <header className={styles.header}>
        <div className={styles.profileSummary}>
          <div className={styles.profileImage}>
            {profile.profile_image ? (
              <img src={profile.profile_image} alt={profile.nickname} />
            ) : (
              <div className={styles.profilePlaceholder}>
                {profile.nickname?.charAt(0) || profile.username.charAt(0)}
              </div>
            )}
          </div>
          <div className={styles.profileInfo}>
            <h1>{profile.nickname || profile.username}</h1>
            <p className={styles.email}>{profile.email}</p>
            {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
          </div>
        </div>

        {/* 통계 */}
        {statistics && (
          <div className={styles.statistics}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{statistics.total_loops}</span>
              <span className={styles.statLabel}>내 루프</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{statistics.total_plays}</span>
              <span className={styles.statLabel}>총 재생</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{statistics.total_favorites}</span>
              <span className={styles.statLabel}>받은 좋아요</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{profile.favorites_count}</span>
              <span className={styles.statLabel}>좋아요한 루프</span>
            </div>
          </div>
        )}
      </header>

      {/* 탭 네비게이션 */}
      <nav className={styles.tabs}>
        <button
          className={activeTab === 'profile' ? styles.active : ''}
          onClick={() => setActiveTab('profile')}
        >
          프로필 설정
        </button>
        <button
          className={activeTab === 'loops' ? styles.active : ''}
          onClick={() => setActiveTab('loops')}
        >
          내 루프
        </button>
        <button
          className={activeTab === 'favorites' ? styles.active : ''}
          onClick={() => setActiveTab('favorites')}
        >
          좋아요
        </button>
      </nav>

      {/* 탭 콘텐츠 */}
      <div className={styles.content}>
        {activeTab === 'profile' && (
          <ProfileSection
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
          />
        )}
        {activeTab === 'loops' && (
          <MyLoopsSection onLoopChange={loadInitialData} />
        )}
        {activeTab === 'favorites' && <FavoritesSection />}
      </div>
    </div>
  );
};

export default MyPage;
