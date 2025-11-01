// src/pages/EditProfile/EditProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from '../../types/mypage';
import { getMyProfile, updateProfile, changePassword } from '../../api/mypage';
import styles from './EditProfilePage.module.css';

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  
  // 프로필 데이터
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 비밀번호 변경
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState<ChangePasswordRequest>({
    old_password: '',
    new_password: '',
    new_password_confirm: '',
  });

  // 상태
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 초기 데이터 로드
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getMyProfile();
      setProfile(data);
      setUsername(data.username);
      setEmail(data.email || '');
      setBio(data.bio || '');
      setImagePreview(data.profile_image || null);
    } catch (err: any) {
      console.error('프로필 로드 실패:', err);
      setError(err.response?.data?.message || '프로필을 불러오는데 실패했습니다.');
      
      // 인증 오류면 로그인 페이지로
      if (err.response?.status === 401) {
        alert('로그인이 필요합니다.');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // 프로필 이미지 선택
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: '이미지는 5MB 이하만 업로드 가능합니다.' });
      return;
    }

    // 이미지 파일인지 체크
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: '이미지 파일만 업로드 가능합니다.' });
      return;
    }

    setProfileImage(file);
    
    // 미리보기
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 프로필 수정 저장
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setMessage(null);

      const data: UpdateProfileRequest = {
        username,
        email,
        bio,
      };

      if (profileImage) {
        data.profile_image = profileImage;
      }

      const updatedProfile = await updateProfile(data);
      setProfile(updatedProfile);
      setMessage({ type: 'success', text: '프로필이 수정되었습니다.' });
      
      // 이미지 초기화
      setProfileImage(null);
      
      // 3초 후 마이페이지로 이동
      setTimeout(() => {
        navigate('/mypage');
      }, 2000);
    } catch (err: any) {
      console.error('프로필 수정 실패:', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || '프로필 수정에 실패했습니다.',
      });
    } finally {
      setSaving(false);
    }
  };

  // 비밀번호 변경
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // 새 비밀번호 확인
    if (passwordData.new_password !== passwordData.new_password_confirm) {
      setMessage({ type: 'error', text: '새 비밀번호가 일치하지 않습니다.' });
      return;
    }

    // 비밀번호 길이 체크
    if (passwordData.new_password.length < 8) {
      setMessage({ type: 'error', text: '비밀번호는 최소 8자 이상이어야 합니다.' });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      await changePassword(passwordData);
      setShowPasswordForm(false);
      setPasswordData({
        old_password: '',
        new_password: '',
        new_password_confirm: '',
      });
      setMessage({ type: 'success', text: '비밀번호가 변경되었습니다.' });
    } catch (err: any) {
      console.error('비밀번호 변경 실패:', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || '비밀번호 변경에 실패했습니다.',
      });
    } finally {
      setSaving(false);
    }
  };

  // 뒤로가기
  const handleBack = () => {
    if (window.confirm('수정 중인 내용이 저장되지 않을 수 있습니다. 돌아가시겠습니까?')) {
      navigate('/mypage');
    }
  };

  // 로딩 중
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  // 에러
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={loadProfile} className={styles.retryButton}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <header className={styles.header}>
        <button onClick={handleBack} className={styles.backButton}>
          ← 돌아가기
        </button>
        <h1 className={styles.title}>프로필 수정</h1>
      </header>

      {/* 메시지 */}
      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      {/* 프로필 수정 폼 */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>기본 정보</h2>
        <form onSubmit={handleSaveProfile} className={styles.form}>
          {/* 프로필 이미지 */}
          <div className={styles.formGroup}>
            <label>프로필 이미지</label>
            <div className={styles.imageUpload}>
              <div className={styles.imagePreview}>
                {imagePreview ? (
                  <img src={imagePreview} alt="프로필" />
                ) : (
                  <div className={styles.placeholder}>
                    {username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className={styles.imageButtons}>
                <label className={styles.uploadButton}>
                  📷 이미지 선택
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setProfileImage(null);
                      setImagePreview(profile.profile_image || null);
                    }}
                    className={styles.resetButton}
                  >
                    초기화
                  </button>
                )}
              </div>
            </div>
            <p className={styles.hint}>* JPG, PNG 형식, 최대 5MB</p>
          </div>

          {/* 사용자명 */}
          <div className={styles.formGroup}>
            <label htmlFor="username">사용자명 *</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={styles.input}
              placeholder="사용자명을 입력하세요"
            />
          </div>

          {/* 이메일 */}
          <div className={styles.formGroup}>
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="이메일을 입력하세요"
            />
          </div>

          {/* 자기소개 */}
          <div className={styles.formGroup}>
            <label htmlFor="bio">자기소개</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className={styles.textarea}
              placeholder="자신을 소개해주세요..."
            />
            <p className={styles.hint}>
              {bio.length} / 500자
            </p>
          </div>

          <div className={styles.formActions}>
            <button 
              type="submit" 
              disabled={saving} 
              className={styles.saveButton}
            >
              {saving ? '저장 중...' : '💾 저장하기'}
            </button>
            <button
              type="button"
              onClick={handleBack}
              disabled={saving}
              className={styles.cancelButton}
            >
              취소
            </button>
          </div>
        </form>
      </div>

      {/* 비밀번호 변경 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>비밀번호 변경</h2>
          {!showPasswordForm && (
            <button
              onClick={() => setShowPasswordForm(true)}
              className={styles.editButton}
            >
              변경하기
            </button>
          )}
        </div>

        {showPasswordForm ? (
          <form onSubmit={handleChangePassword} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="old_password">현재 비밀번호 *</label>
              <input
                id="old_password"
                type="password"
                value={passwordData.old_password}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, old_password: e.target.value })
                }
                required
                className={styles.input}
                placeholder="현재 비밀번호를 입력하세요"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="new_password">새 비밀번호 *</label>
              <input
                id="new_password"
                type="password"
                value={passwordData.new_password}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, new_password: e.target.value })
                }
                required
                className={styles.input}
                placeholder="새 비밀번호를 입력하세요"
              />
              <p className={styles.hint}>* 최소 8자 이상</p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="new_password_confirm">새 비밀번호 확인 *</label>
              <input
                id="new_password_confirm"
                type="password"
                value={passwordData.new_password_confirm}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    new_password_confirm: e.target.value,
                  })
                }
                required
                className={styles.input}
                placeholder="새 비밀번호를 다시 입력하세요"
              />
            </div>

            <div className={styles.formActions}>
              <button 
                type="submit" 
                disabled={saving} 
                className={styles.saveButton}
              >
                {saving ? '변경 중...' : '🔒 비밀번호 변경'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({
                    old_password: '',
                    new_password: '',
                    new_password_confirm: '',
                  });
                }}
                disabled={saving}
                className={styles.cancelButton}
              >
                취소
              </button>
            </div>
          </form>
        ) : (
          <p className={styles.infoText}>
            보안을 위해 주기적으로 비밀번호를 변경해주세요.
          </p>
        )}
      </div>

      {/* 계정 정보 */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>계정 정보</h2>
        <div className={styles.infoList}>
          <div className={styles.infoItem}>
            <span className={styles.label}>가입일</span>
            <span className={styles.value}>
              {profile.created_at
                ? new Date(profile.created_at).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : '알 수 없음'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>작성한 게시물</span>
            <span className={styles.value}>{profile.posts_count || 0}개</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>좋아요한 게시물</span>
            <span className={styles.value}>{profile.favorites_count || 0}개</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
