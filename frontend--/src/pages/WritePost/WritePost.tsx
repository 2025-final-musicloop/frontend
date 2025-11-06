import React, { useState, useContext, ChangeEvent} from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './WritePost.module.css';
import { AuthContext } from '../../context/AuthContext';
import { createPost } from '../../api/posts';
import imageCompression from 'browser-image-compression';

const WritePost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isResizing, setIsResizing] = useState(false);

  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);
  
 const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 압축 옵션 설정 (자유롭게 조절 가능)
    const options = {
      maxSizeMB: 1,          // 1. 최대 파일 크기를 1MB로 제한합니다.
      maxWidthOrHeight: 1920, // 2. 이미지의 최대 너비 또는 높이를 1920px로 조절합니다.
      useWebWorker: true,    // 3. 웹 워커를 사용해 압축 속도를 높입니다.
    };

    try {
      setIsResizing(true); // 압축 시작
      console.log(`압축 전 원본 파일 크기: ${(file.size / 1024 / 1024).toFixed(2)} MB`);

      const compressedFile = await imageCompression(file, options);
      
      console.log(`압축 후 파일 크기: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
      setImageFile(compressedFile); // ⭐️ 압축된 파일을 상태에 저장
      
    } catch (error) {
      console.error('이미지 압축 실패:', error);
      alert('이미지 처리 중 오류가 발생했습니다. 원본 파일로 업로드합니다.');
      setImageFile(file); // ⭐️ 실패 시 원본 파일을 그대로 사용
    } finally {
      setIsResizing(false); // 압축 종료
    }
  };

  const handleAudioChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('📦 accessToken:', accessToken);

    if (!accessToken || accessToken.trim() === '') {
      alert('로그인이 필요합니다. accessToken이 없습니다.');
      navigate('/my');
      return;
    }

    try {
      // ⭐️ 파일과 텍스트를 함께 전송하도록 수정
      await createPost({ title, content, imageFile, audioFile }, accessToken);
      alert('게시글이 성공적으로 작성되었습니다.');
      navigate('/explore');
    } catch (error) {
      console.error('❌ 글 작성 오류:', error);
      alert('글 작성에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    navigate('/explore');
  };

  return (
    <div className={styles.mainContent}>
      <div className={styles.header}>
        <h1 className={styles.title}>새 글 작성</h1>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.titleInput}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.label}>내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles.contentInput}
            rows={15}
            required
          />
        </div>
        
        {/* ⭐️ 파일 업로드 UI 추가 */}
        <div className={styles.formGroup}>
          <label htmlFor="image-file" className={styles.label}>이미지 파일</label>
          <input type="file" id="image-file" accept="image/*" onChange={handleImageChange} />
          {imageFile && <p style={{color: 'gray', marginTop: '8px'}}>선택: {imageFile.name}</p>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="audio-file" className={styles.label}>오디오 파일</label>
          <input type="file" id="audio-file" accept="audio/*" onChange={handleAudioChange} />
          {audioFile && <p style={{color: 'gray', marginTop: '8px'}}>선택: {audioFile.name}</p>}
        </div>

        <div className={styles.buttonGroup}>
          <button type="button" onClick={handleCancel} className={styles.cancelButton}>취소</button>
          <button type="submit" className={styles.submitButton} disabled={!title.trim() || !content.trim()}>작성하기</button>
        </div>
      </form>
    </div>
  );
};

export default WritePost;