import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './MyPage.module.css';

const MyPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleMyWorks = () => {
    navigate('/my-works');
  };

  const handleCollaborations = () => {
    navigate('/collaborations');
  };

  const handleMyPosts = () => {
    navigate('/my-posts');
  };

  const handleFavorites = () => {
    navigate('/favorites');
  };

  return (
    <div className={styles.pageContainer}>
      {/* 헤더 */}
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>마이페이지</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          로그아웃
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <div className={styles.mainContent}>
        {/* 사용자 정보 */}
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <div className={styles.profileImage}>
              {user?.profileImage ? (
                <img src={user.profileImage} alt="프로필" />
              ) : (
                <div className={styles.profilePlaceholder}>
                  <span>{(user?.name || user?.username || 'U').charAt(0)}</span>
                </div>
              )}
            </div>
            <div className={styles.userDetails}>
              <h2 className={styles.userName}>{user?.name || user?.username || '사용자'}</h2>
              <p className={styles.userEmail}>{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>

        {/* 메뉴 섹션 */}
        <div className={styles.menuSection}>
          <div className={styles.menuItem} onClick={handleMyWorks}>
            <span className={styles.menuText}>내 작업물 리스트</span>
            <div className={styles.menuArrow}>→</div>
          </div>

          <div className={styles.menuItem} onClick={handleCollaborations}>
            <span className={styles.menuText}>공동 제작</span>
            <div className={styles.menuArrow}>→</div>
          </div>

          <div className={styles.menuItem} onClick={handleMyPosts}>
            <span className={styles.menuText}>내 게시물 리스트</span>
            <div className={styles.menuArrow}>→</div>
          </div>

          <div className={styles.menuItem} onClick={handleFavorites}>
            <span className={styles.menuText}>내 즐겨찾기 리스트</span>
            <div className={styles.menuArrow}>→</div>
          </div>

          <div className={styles.menuItem} onClick={handleEditProfile}>
            <span className={styles.menuText}>내 정보 수정</span>
            <div className={styles.menuArrow}>→</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
