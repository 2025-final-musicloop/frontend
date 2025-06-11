import React from 'react';
import classNames from 'classnames';
import styles from './HeroSection.module.css';
import BlobBackground from './BlobBackground';
import Button from './Button';
import type { HeroSectionProps } from '../types';

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartClick, onIntroClick, onContactClick }) => {
  return (
    <section className={styles.heroSection}>
      {/* 배경 Blob */}
      <BlobBackground />

      {/* 그라데이션 텍스트 타이틀 */}
      <h1
        className={classNames(
          'text-7xl',
          'font-extrabold',
          'mb-6',
          'bg-clip-text',
          'text-transparent',
          'bg-gradient-to-r',
          'from-primary',
          'to-secondary-purple',
        )}
      >
        AI 반주 생성
      </h1>

      {/* 부제목 */}
      <p className={styles.subTitle}>문구</p>

      {/* 설명 문구 */}
      <p className={styles.description}>
        서비스 소개
        <br />
        서비스 설명
      </p>

      {/* "지금 시작하기" 버튼 */}
      <div className={styles.startButtonWrapper}>
        <Button variant="primary" size="lg" onClick={onStartClick} className="flex items-center space-x-2">
          <span className="material-icons-outlined">mic</span>
          <span>지금 시작하기</span>
        </Button>
      </div>

      {/* 서비스 소개 / 문의하기 버튼 그룹 */}
      <div className={styles.buttonGroup}>
        <Button variant="secondary" size="md" border="secondary" onClick={onIntroClick}>
          서비스 소개
        </Button>
        <Button variant="secondary" size="md" border="secondary" onClick={onContactClick}>
          문의하기
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
