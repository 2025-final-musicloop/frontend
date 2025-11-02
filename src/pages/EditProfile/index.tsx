import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EditProfile.module.css';
import { getUserProfile, updateUserProfile } from '../../api/mypage';
import type { UserProfile } from '../../types/mypage';

const EditProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    email: '',
    bio: '',
    avatar: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await getUserProfile();
      setProfile(data);
    } catch (error) {
      console.error('프로필을 불러오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await updateUserProfile(profile);
      alert('프로필이 성공적으로 업데이트되었습니다.');
      navigate('/my');
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      alert('프로필 업데이트에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <p className={styles.loadingText}>프로필을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          ← 돌아가기
        </button>
        <h1 className={styles.title}>프로필 편집</h1>
        <p className={styles.subtitle}>내 정보를 수정해보세요</p>
      </div>

      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              {profile.avatar ? (
                <img src={profile.avatar} alt="프로필" className={styles.avatar} />
              ) : (
                <div className={styles.avatarPlaceholder}>👤</div>
              )}
            </div>
            <button type="button" className={styles.changeAvatarButton}>
              📷 사진 변경
            </button>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              사용자명
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className={styles.input}
              placeholder="사용자명을 입력하세요"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="bio" className={styles.label}>
              소개
            </label>
            <textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="자기소개를 입력하세요"
              rows={4}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={styles.cancelButton}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={styles.saveButton}
            >
              {isSaving ? '저장 중...' : '💾 저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
