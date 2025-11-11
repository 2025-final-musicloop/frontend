import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EditProfile.module.css';
import { getMyProfile, updateProfile } from '../../api/mypage';
import type { UserProfile } from '../../types/mypage';

const EditProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>({
    id: 0,
    username: '',
    email: '',
    bio: '',
    profile_image: null,
    created_at: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await getMyProfile();
      setProfile(data);
      if (data.profile_image) {
        setPreviewUrl(data.profile_image);
      }
    } catch (error) {
      console.error('프로필을 불러오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);

      const updateData: {
        username?: string;
        email?: string;
        bio?: string;
        profile_image?: File;
      } = {};

      // 변경된 값만 포함
      if (profile.username?.trim()) updateData.username = profile.username;
      if (profile.email?.trim()) updateData.email = profile.email;
      if (profile.bio !== undefined) updateData.bio = profile.bio; // 빈 문자열도 허용
      if (selectedImage) updateData.profile_image = selectedImage;

      // 업데이트할 데이터가 있는지 확인
      if (Object.keys(updateData).length === 0) {
        alert('변경된 내용이 없습니다.');
        return;
      }

      await updateProfile(updateData);
      alert('프로필이 성공적으로 업데이트되었습니다.');
      navigate('/my');
    } catch (error: any) {
      console.error('프로필 업데이트 실패:', error);
      alert(error.response?.data?.message || '프로필 업데이트에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

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
              <h1 className={styles.boardTitle}>프로필 편집</h1>
              <p className={styles.subtitle}>내 정보를 수정해보세요</p>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>프로필을 불러오는 중...</p>
          </div>
        ) : (
          <div className={styles.contentWrapper}>
            <div className={styles.formCard}>
              <form onSubmit={handleSubmit} className={styles.form}>
                {/* 프로필 이미지 섹션 */}
                <div className={styles.avatarSection}>
                  <div className={styles.avatarWrapper}>
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="프로필"
                        className={styles.avatar}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>👤</div>
                    )}
                  </div>
                  <label
                    htmlFor="profile-image"
                    className={styles.changeAvatarButton}
                  >
                    📷 사진 변경
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                {/* 사용자명 */}
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
                  />
                </div>

                {/* 이메일 */}
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
                  />
                </div>

                {/* 자기소개 */}
                <div className={styles.formGroup}>
                  <label htmlFor="bio" className={styles.label}>
                    자기소개
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    className={styles.textarea}
                    rows={4}
                    placeholder="자신에 대해 간단히 소개해주세요"
                  />
                </div>

                {/* 버튼 그룹 */}
                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className={styles.cancelButton}
                    disabled={isSaving}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={isSaving}
                  >
                    {isSaving ? '저장 중...' : '저장'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
