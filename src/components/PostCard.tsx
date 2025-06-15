import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PostCard.module.css';
import type { Post } from '../api/posts';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/posts/${post.postId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={styles.postCard} onClick={handleClick}>
      <div className={styles.imageContainer}>
        <img src="/ex.jpg" alt="게시글 이미지" className={styles.postImage} />
      </div>
      <div className={styles.postContent}>
        <div className={styles.postHeader}>
          <h3 className={styles.postTitle}>{post.title}</h3>
          <span className={styles.postDate}>{formatDate(post.createdAt)}</span>
        </div>
        <p className={styles.postDescription}>{post.description}</p>
        <div className={styles.postFooter}>
          <span className={styles.postId}>#{post.postId}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
