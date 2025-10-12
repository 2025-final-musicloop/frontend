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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      try {
        const post = await getPostById(Number(id));
        setTitle(post.title);
        setContent(post.content);
      } catch (error) {
        alert('게시글 정보를 불러오지 못했습니다.');
        navigate('/explore');
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !accessToken) return;
    setLoading(true);
    try {
      await updatePost(Number(id), title, content, accessToken);
      alert('글이 성공적으로 수정되었습니다.');
      navigate(`/post/${id}`);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        alert(`글 수정 실패: ${error.response.data.detail}`);
      } else {
        alert('글 수정에 실패했습니다. 다시 시도해주세요.');
      }
    }
    setLoading(false);
  };

  const handleCancel = () => {
    if (!id) {
      navigate('/explore');
      return;
    }
    navigate(`/post/${id}`);
  };

  return (
    <div className={styles.writePostContainer}>
      <h2>게시글 수정</h2>
      <form onSubmit={handleSubmit} className={styles.writePostForm}>
        <div className={styles.inputGroup}>
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={e => setContent(e.target.value)}
            className={styles.textarea}
            required
          />
        </div>
        <div className={styles.buttonGroup}>
          <button type="button" onClick={handleCancel} className={styles.cancelButton}>
            취소
          </button>
          <button type="submit" className={styles.submitButton} disabled={!title.trim() || !content.trim() || loading}>
            저장하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostEdit;
