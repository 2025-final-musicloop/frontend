import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../WritePost/WritePost.module.css';
import { AuthContext } from '../../context/AuthContext';
import { getPostById, updatePost } from '../../api/posts';

const PostEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  
  // 파일 관련 state 추가
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [existingAudio, setExistingAudio] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const numericId = Number(id);
        const post = await getPostById(numericId, accessToken);
        setTitle(post.title);
        setContent(post.content);
        // 기존 파일 정보 저장
        if (post.image) setExistingImage(post.image);
        if (post.audio_file) setExistingAudio(post.audio_file);
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
        alert('게시글 정보를 불러오지 못했습니다.');
        navigate('/explore');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, accessToken, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!accessToken || accessToken.trim() === '') {
      alert('로그인이 필요합니다.');
      navigate('/my');
      return;
    }

    try {
      const numericId = Number(id);
      await updatePost(
        numericId,
        {
          title,
          content,
          imageFile,
          audioFile,
        },
        accessToken
      );
      alert('수정이 완료되었습니다.');
      navigate(`/post/${numericId}`);
    } catch (error: any) {
      console.error('글 수정 오류:', error);
      if (error.response && error.response.data && error.response.data.detail) {
        alert(`글 수정 실패: ${error.response.data.detail}`);
      } else {
        alert('글 수정에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleCancel = () => {
    if (!id) {
      navigate('/explore');
      return;
    }
    navigate(`/post/${id}`);
  };

  // 이미지 파일 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // 오디오 파일 선택 핸들러
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  if (loading) {
    return <div className={styles.mainContent}>불러오는 중...</div>;
  }

  return (
    <div className={styles.mainContent}>
      <div className={styles.header}>
        <h1 className={styles.title}>글 수정</h1>
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

        {/* 이미지 파일 업로드 */}
        <div className={styles.formGroup}>
          <label htmlFor="image" className={styles.label}>
            이미지 파일
          </label>
          {existingImage && (
            <div className={styles.existingFile}>
              <p>현재 이미지:</p>
              <img src={existingImage} alt="기존 이미지" style={{ maxWidth: '200px', marginBottom: '10px' }} />
            </div>
          )}
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.fileInput}
          />
          {imageFile && <p className={styles.fileName}>새로운 파일: {imageFile.name}</p>}
        </div>

        {/* 오디오 파일 업로드 */}
        <div className={styles.formGroup}>
          <label htmlFor="audio" className={styles.label}>
            오디오 파일
          </label>
          {existingAudio && (
            <div className={styles.existingFile}>
              <p>현재 오디오:</p>
              <audio controls src={existingAudio} style={{ marginBottom: '10px' }} />
            </div>
          )}
          <input
            type="file"
            id="audio"
            accept="audio/*"
            onChange={handleAudioChange}
            className={styles.fileInput}
          />
          {audioFile && <p className={styles.fileName}>새로운 파일: {audioFile.name}</p>}
        </div>

        <div className={styles.buttonGroup}>
          <button type="button" onClick={handleCancel} className={styles.cancelButton}>
            취소
          </button>
          <button type="submit" className={styles.submitButton} disabled={!title.trim() || !content.trim()}>
            저장하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostEdit;