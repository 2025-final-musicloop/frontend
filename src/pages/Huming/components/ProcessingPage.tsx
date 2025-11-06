import React, { useState, useEffect } from 'react';
import { ProcessingResult } from '../../../components/common/ProcessFlow';
import styles from './ProcessingPage.module.css';

interface ProcessingPageProps {
  onProcessingComplete: (result: ProcessingResult) => void;
}

const ProcessingPage: React.FC<ProcessingPageProps> = ({ onProcessingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);

  const steps = ['음성 파일 분석 중...', 'AI가 음악을 생성하고 있습니다...', '악기와 반주를 추가하고 있습니다...'];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsProcessing(false);

          // 완료 후 결과 전달
          setTimeout(() => {
            const result: ProcessingResult = {
              musicUrl: '/mock-music.mp3',
              title: '생성된 음악',
              duration: 180,
            };
            onProcessingComplete(result);
          }, 1000);

          return 100;
        }
        return prev + 2;
      });
    }, 100);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return steps.length - 1;
        }
        return prev + 1;
      });
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [onProcessingComplete, steps.length]);

  const handleSkipProcessing = () => {
    const mockResult: ProcessingResult = {
      musicUrl: '/mock-music.mp3',
      title: '테스트 음악',
      duration: 180,
    };
    onProcessingComplete(mockResult);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
          <div className={styles.animatedCircle}></div>
        </div>

        <h1 className={styles.title}>AI가 음악을 만들고 있습니다</h1>
        <p className={styles.description}>AI가 음성을 분석하고 음악을 생성하고 있습니다. 잠시만 기다려주세요.</p>

        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
          </div>
          <div className={styles.progressText}>{progress}%</div>
        </div>

        <div className={styles.stepsContainer}>
          {steps.map((step, index) => (
            <div key={index} className={`${styles.step} ${index <= currentStep ? styles.active : ''}`}>
              <span className={`material-icons ${styles.stepIcon}`}>
                {index < currentStep ? 'check_circle' : 'radio_button_unchecked'}
              </span>
              <span className={styles.stepText}>{step}</span>
            </div>
          ))}
        </div>

        <button className={styles.cancelButton}>
          <span className="material-icons">close</span>
          취소
        </button>
      </div>

      {/* 고정된 테스트 버튼들 */}
      <div className={styles.fixedTestButtons}>
        <button className={styles.testButton} onClick={handleSkipProcessing}>
          처리 건너뛰기
        </button>
      </div>
    </div>
  );
};

export default ProcessingPage;
