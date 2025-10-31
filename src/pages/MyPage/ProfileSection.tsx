import { useState } from 'react';
import { UserProfile, PasswordChangeData } from '../../types/mypage';
import {
  updateProfile,
  uploadProfileImage,
  deleteProfileImage,
  changePassword,
} from '../../api/mypage';
import styles from './MyPage.module.css';

interface ProfileSectionProps {
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

const ProfileSection = ({ profile, onProfileUpdate }: ProfileSectionProps) => {
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(profile.nickname);
  const [bio, setBio] = useState(profile.bio);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 비밀번호 변경
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    old_password: '',
    new_password: '',
    new_password_confirm: '',
  });

  // 프로필 수정 저장
  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setMessage('');
      const response = await updateProfile({ nickname, bio });
      if (response.data) {
        onProfileUpdate(response.data);
        setEditing(false);
        setMessage('프로필이 수정되었습니다.');
      }
    } catch (err: any) {
      setMessage(err.response?.data?.error || '프로필 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 프로필 이미지 업로드
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage('이미지는 5MB 이하만 업로드 가능합니다.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      const response = await uploadProfileImage(file);
      if (response.data) {
        onProfileUpdate(response.data);
        setMessage('프로필 이미지가 업로드되었습니다.');
      }
    } catch (err: any) {
      setMessage(err.response?.data?.error || '이미지 업로드에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 프로필 이미지 삭제
  const handleDeleteImage = async () => {
    if (!confirm('프로필 이미지를 삭제하시겠습니까?')) return;

    try {
      setLoading(true);
      setMessage('');
      await deleteProfileImage();
      const updatedProfile = { ...profile, profile_image: null };
      onProfileUpdate(updatedProfile);
      setMessage('프로필 이미지가 삭제되었습니다.');
    } catch (err: any) {
      setMessage(err.response?.data?.error || '이미지 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 비밀번호 변경
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.new_password_confirm) {
      setMessage('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      await changePassword(passwordData);
      setMessage('비밀번호가 변경되었습니다.');
      setShowPasswordChange(false);
      setPasswordData({
        old_password: '',
        new_password: '',
        new_password_confirm: '',
      });
    } catch (err: any) {
      const errors = err.response?.data;
      if (errors?.old_password) {
        setMessage(errors.old_password[0]);
      } else if (errors?.new_password) {
        setMessage(errors.new_password[0]);
      } else {
        setMessage('비밀번호 변경에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.profileSection}>
      {message && (
        <div className={`${styles.message} ${message.includes('실패') ? styles.error : styles.success}`}>
          {message}
        </div>
      )}

      {/* 프로필 이미지 */}
      <div>
        <div className={styles.sectionHeader}>
          <h2>프로필 이미지</h2>
        </div>
        <div className={styles.imageControls}>
          <div className={styles.currentImage}>
            {profile.profile_image ? (
              <img src={profile.profile_image} alt="프로필" />
            ) : (
              <div className={styles.placeholder}>
                {profile.nickname?.charAt(0) || profile.username.charAt(0)}
              </div>
            )}
          </div>
          <div className={styles.imageButtons}>
            <label className={styles.uploadButton}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={loading}
              />
              이미지 업로드
            </label>
            {profile.profile_image && (
              <button
                onClick={handleDeleteImage}
                disabled={loading}
                className={styles.deleteButton}
              >
                이미지 삭제
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 프로필 정보 */}
      <div>
        <div className={styles.sectionHeader}>
          <h2>프로필 정보</h2>
          {!editing && (
            <button onClick={() => setEditing(true)}>수정</button>
          )}
        </div>

        {editing ? (
          <div className={styles.editForm}>
            <div className={styles.formGroup}>
              <label>닉네임</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요"
              />
            </div>
            <div className={styles.formGroup}>
              <label>자기소개</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="자기소개를 입력하세요"
                rows={4}
              />
            </div>
            <div className={styles.formActions}>
              <button onClick={handleSaveProfile} disabled={loading}>
                {loading ? '저장 중...' : '저장'}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setNickname(profile.nickname);
                  setBio(profile.bio);
                }}
                disabled={loading}
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.profileDisplay}>
            <div className={styles.infoItem}>
              <span className={styles.label}>이메일</span>
              <span className={styles.value}>{profile.email}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>사용자명</span>
              <span className={styles.value}>{profile.username}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>닉네임</span>
              <span className={styles.value}>{profile.nickname || '미설정'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>자기소개</span>
              <span className={styles.value}>{profile.bio || '미설정'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>가입일</span>
              <span className={styles.value}>
                {new Date(profile.date_joined).toLocaleDateString('ko-KR')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 비밀번호 변경 */}
      <div>
        <div className={styles.sectionHeader}>
          <h2>비밀번호</h2>
          {!showPasswordChange && (
            <button onClick={() => setShowPasswordChange(true)}>
              비밀번호 변경
            </button>
          )}
        </div>

        {showPasswordChange && (
          <form onSubmit={handlePasswordChange} className={styles.passwordForm}>
            <div className={styles.formGroup}>
              <label>현재 비밀번호</label>
              <input
                type="password"
                value={passwordData.old_password}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, old_password: e.target.value })
                }
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>새 비밀번호</label>
              <input
                type="password"
                value={passwordData.new_password}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, new_password: e.target.value })
                }
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>새 비밀번호 확인</label>
              <input
                type="password"
                value={passwordData.new_password_confirm}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    new_password_confirm: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className={styles.formActions}>
              <button type="submit" disabled={loading}>
                {loading ? '변경 중...' : '변경'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordChange(false);
                  setPasswordData({
                    old_password: '',
                    new_password: '',
                    new_password_confirm: '',
                  });
                }}
                disabled={loading}
              >
                취소
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
