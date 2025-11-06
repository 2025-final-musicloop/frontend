import React from 'react';
import styles from './BlobBackground.module.css';
import type { BlobBackgroundProps } from '../../types';

const Blob: React.FC<{
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
  bgColor: string;
  delay?: number;
}> = ({ top, left, bottom, right, bgColor, delay = 0 }) => {
  const positionStyle: React.CSSProperties = {
    top: top,
    left: left,
    bottom: bottom,
    right: right,
    animationDelay: `${delay}ms`,
  };

  return <div className={`${styles.blob} ${bgColor}`} style={positionStyle} />;
};

export const BlobBackground: React.FC = () => {
  return (
    <div className={styles.blobWrapper}>
      <Blob top="25%" left="25%" bgColor="bg-purple-300" delay={0} />
      <Blob top="50%" left="50%" bgColor="bg-pink-300" delay={2000} />
      <Blob bottom="25%" right="25%" bgColor="bg-indigo-300" delay={4000} />
    </div>
  );
};

export default BlobBackground;
