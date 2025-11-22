import React, { useState } from 'react';
import styles from './ModelSelection.module.css';

interface ModelSelectionProps {
  onModelSelect: (modelType: 'api' | 'internal') => void;
}

const ModelSelection: React.FC<ModelSelectionProps> = ({ onModelSelect }) => {
  const [selectedModel, setSelectedModel] = useState<'api' | 'internal' | null>(null);

  const handleModelSelect = (modelType: 'api' | 'internal') => {
    setSelectedModel(modelType);
  };

  const handleNext = () => {
    if (selectedModel) {
      onModelSelect(selectedModel);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>생성 모델 선택</h1>
        <p className={styles.description}>음악 생성을 위해 사용할 모델을 선택해주세요.</p>
      </div>

      <div className={styles.modelOptions}>
        <button
          className={`${styles.modelCard} ${selectedModel === 'api' ? styles.selected : ''}`}
          onClick={() => handleModelSelect('api')}
        >
          <div className={styles.modelIcon}>
            <span className="material-icons">cloud</span>
          </div>
          <h3 className={styles.modelTitle}>기존 API (GCP)</h3>
          <p className={styles.modelDescription}>Google Cloud AI를 사용한 고품질 음악 생성</p>
          <div className={styles.modelFeatures}>
            <span className={styles.feature}>고품질</span>
            <span className={styles.feature}>자유로운 옵션</span>
          </div>
        </button>

        <button
          className={`${styles.modelCard} ${selectedModel === 'internal' ? styles.selected : ''}`}
          onClick={() => handleModelSelect('internal')}
        >
          <div className={styles.modelIcon}>
            <span className="material-icons">memory</span>
          </div>
          <h3 className={styles.modelTitle}>내부 모델</h3>
          <p className={styles.modelDescription}>학습 모델을 사용한 빠른 음악 생성</p>
          <div className={styles.modelFeatures}>
            <span className={styles.feature}>저품질</span>
            <span className={styles.feature}>WAV 형식</span>
          </div>
          <div className={styles.warning}>
            <span>WAV 파일만 지원합니다</span>
          </div>
        </button>
      </div>

      <div className={styles.footer}>
        <button className={styles.nextButton} onClick={handleNext} disabled={!selectedModel}>
          <span className="material-icons">arrow_forward</span>
          다음 단계로
        </button>
      </div>
    </div>
  );
};

export default ModelSelection;
