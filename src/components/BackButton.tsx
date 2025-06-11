import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import styles from './BackButton.module.css';

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Button onClick={handleBack} variant="secondary" size="sm" border="secondary" className={styles.backButton}>
      뒤로가기
    </Button>
  );
};

export default BackButton;
