import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import styles from './WritePost.module.css';

const WritePost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleMenuClick = (menuId: string) => {
    if (menuId === 'home') {
      navigate('/');
    } else {
      navigate(`/${menuId}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 임시로 콘솔에 출력 (나중에 API 연동)
    console.log('글 작성:', { title, content });

    // 작성 완료 후 게시판으로 이동
    navigate('/explore');
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
