import React, { useState, useRef } from 'react';
import styles from './AudioUpload.module.css';

interface AudioUploadProps {
  onAudioUpload: (file: File) => void;
}

const AudioUpload: React.FC<AudioUploadProps> = ({ onAudioUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // 파일 타입 검증
    if (!file.type.startsWith('audio/')) {
      setError('오디오 파일만 업로드 가능합니다.');
      return false;
    }

    // 파일 크기 검증 (5분 = 300초, 대략적인 크기 추정)
    const maxSize = 50 * 1024 * 1024; // 50MB (5분 음악 파일 대략적 크기)
    if (file.size > maxSize) {
      setError('파일 크기가 너무 큽니다. 5분 이내의 음악 파일을 업로드해주세요.');
      return false;
    }

    setError('');
    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onAudioUpload(selectedFile);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // 임시 테스트 함수들
  const createTempFile = () => {
    const tempFile = new File(['temp audio content'], 'temp-audio.mp3', {
      type: 'audio/mpeg',
    });
    setSelectedFile(tempFile);
    setError('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.uploadSection}>
        <div
          className={`${styles.uploadArea} ${isDragOver ? styles.dragOver : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <div className={styles.uploadContent}>
            <span className={`material-icons ${styles.uploadIcon}`}>music_note</span>
            <h3 className={styles.uploadTitle}>음악 파일 업로드</h3>
            <p className={styles.uploadText}>드래그 앤 드롭으로 파일을 업로드하거나 클릭하여 파일을 선택하세요</p>
            <p className={styles.uploadHint}>지원 형식: MP3, WAV, M4A (최대 5분)</p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileInputChange}
          className={styles.hiddenInput}
        />

        {selectedFile && (
          <div className={styles.fileInfo}>
            <span className="material-icons">check_circle</span>
            <span>{selectedFile.name}</span>
            <span className={styles.fileSize}>({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <span className="material-icons">error</span>
            {error}
          </div>
        )}

        <button className={styles.primaryButton} onClick={handleUpload} disabled={!selectedFile}>
          <span className="material-icons">upload</span>
          다음 단계로
        </button>
      </div>

      {/* 고정된 테스트 버튼들 */}
      <div className={styles.fixedTestButtons}>
        <button className={styles.testButton} onClick={createTempFile}>
          임시 파일 생성
        </button>
        <button
          className={styles.testButton}
          onClick={() => onAudioUpload(new File(['test'], 'test.mp3', { type: 'audio/mpeg' }))}
        >
          다음 단계로
        </button>
      </div>
    </div>
  );
};

export default AudioUpload;
