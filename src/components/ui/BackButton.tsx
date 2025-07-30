import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import styles from './BackButton.module.css';
import type { BackButtonProps } from '../../types';

const BackButton: React.FC<BackButtonProps> = ({ onClick, className }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <Button onClick={handleBack} variant="secondary" size="sm" className={`${styles.backButton} ${className || ''}`}>
      뒤로가기
    </Button>
  );
};

export default BackButton;
