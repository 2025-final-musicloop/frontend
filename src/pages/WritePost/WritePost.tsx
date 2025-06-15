import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import styles from './WritePost.module.css';
import { AuthContext } from '../../context/AuthContext';
import { createPost } from '../../api/posts';

const WritePost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const { accessToken, user } = useContext(AuthContext);

  const handleMenuClick = (menuId: string) => {
    if (menuId === 'home') {
      navigate('/');
    } else {
      navigate(`/${menuId}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('📦 accessToken:', accessToken ? accessToken.substring(0, 20) + '...' : '없음');
    console.log('👤 user:', user);

    if (!accessToken || accessToken.trim() === '') {
      alert('로그인이 필요합니다. accessToken이 없습니다.');
      navigate('/login');
      return;
    }

    if (!user) {
      alert('사용자 정보가 없습니다. 다시 로그인해주세요.');
      navigate('/login');
      return;
    }

    try {
      const result = await createPost(title, content);
      console.log('✅ 글 작성 성공:', result);
      alert('글 작성이 완료되었습니다!');
      navigate('/explore');
    } catch (error: any) {
      console.error('❌ 글 작성 오류:', error);

      // 토큰 관련 오류 처리
      if (error.response?.status === 401) {
        alert('인증이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
        return;
      }

      // 서버에서 에러 메시지가 있는 경우 표시
      if (error.response?.data?.detail) {
        alert(`글 작성 실패: ${error.response.data.detail}`);
      } else if (error.message) {
        alert(`글 작성 실패: ${error.message}`);
      } else {
        alert('글 작성에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleCancel = () => {
    navigate('/explore');
  };

  return (
    <div className={styles.pageContainer}>
      <Sidebar activeMenu="explore" onMenuClick={handleMenuClick} />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1 className={styles.title}>새 글 작성</h1>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.titleInput}
              placeholder="제목을 입력하세요"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content" className={styles.label}>
              내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={styles.contentInput}
              placeholder="내용을 입력하세요"
              rows={15}
              required
            />
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" onClick={handleCancel} className={styles.cancelButton}>
              취소
            </button>
            <button type="submit" className={styles.submitButton} disabled={!title.trim() || !content.trim()}>
              작성하기
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default WritePost;
