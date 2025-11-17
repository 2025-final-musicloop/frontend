import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ProcessingResult } from '../../../components/common/ProcessFlow';
import { MusicDetails } from '../../../components/common/ProcessFlow';
import styles from './ProcessingPage.module.css';

interface ProcessingPageProps {
  onProcessingComplete: (result: ProcessingResult) => void;
  onProcessingError: (errorMessage: string) => void;
  formData: {
    audioFile: File;
    details: MusicDetails;
    modelType: 'api' | 'internal';
  };
  endpoint?: string; // 기본값: '/generate-from-humming', 장르변환: '/convert-genre'
  resultTitle?: string; // 기본값: '새로운 허밍 음악'
}

interface ApiResponse {
  status: string;
  audio_url: string;
  duration: number;
}

const ProcessingPage: React.FC<ProcessingPageProps> = ({ 
  onProcessingComplete, 
  onProcessingError, 
  formData,
  endpoint = '/generate-from-humming',
  resultTitle = '새로운 허밍 음악'
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const isCompleteRef = useRef(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const stepIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const steps = ['음성 파일 분석 중...', 'AI가 음악을 생성하고 있습니다...', '악기와 반주를 추가하고 있습니다...'];

  useEffect(() => {
    // 실제 API 호출 시작
    const callAPI = async () => {
      const formDataToSend = new FormData();
      formDataToSend.append('audio', formData.audioFile);
      
      // 엔드포인트에 따라 다른 데이터 전송
      if (endpoint === '/convert-genre') {
        // 장르변환: 장르, 분위기, 커스텀 프롬프트만 전송
        formDataToSend.append('genre', formData.details.genre || 'Rock');
        formDataToSend.append('mood', formData.details.mood || 'Energetic');
        formDataToSend.append('custom_prompt', formData.details.customPrompt || '');
      } else {
        // 허밍 기반 생성: 내부 모델일 때는 악기만, API일 때는 장르/분위기/악기 모두 전송
        if (formData.modelType === 'internal') {
          formDataToSend.append('instruments[]', formData.details.instrument || '피아노');
        } else {
          formDataToSend.append('genre', formData.details.genre || 'Pop Ballad');
          formDataToSend.append('mood', formData.details.mood || 'Happy');
          formDataToSend.append('instruments[]', formData.details.instrument || 'Piano');
          formDataToSend.append('custom_prompt', formData.details.customPrompt || '');
        }
        formDataToSend.append('model_type', formData.modelType);
      }

      try {
        // 진행도 시뮬레이션 (0% -> 90%)
        let simulatedProgress = 0;
        progressIntervalRef.current = setInterval(() => {
          if (simulatedProgress < 90 && !isCompleteRef.current) {
            simulatedProgress += Math.random() * 3; // 랜덤하게 증가
            if (simulatedProgress > 90) simulatedProgress = 90;
            setProgress(Math.floor(simulatedProgress));
          }
        }, 200);

        // 단계 시뮬레이션
        let stepIndex = 0;
        stepIntervalRef.current = setInterval(() => {
          if (stepIndex < steps.length - 1 && !isCompleteRef.current) {
            stepIndex++;
            setCurrentStep(stepIndex);
          }
        }, 3000);

        // 실제 API 호출
        const response = await axios.post<ApiResponse>(`http://localhost:5000${endpoint}`, formDataToSend, {
          timeout: 300000, // 5분 타임아웃
        });

        // API 호출 완료 - 진행도를 100%로 설정
        isCompleteRef.current = true;
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
        if (stepIntervalRef.current) {
          clearInterval(stepIntervalRef.current);
        }
        
        // 진행도를 100%로 만들기
        setProgress(100);
        setCurrentStep(steps.length - 1);
        
        // 바가 100%가 될 때까지 약간의 딜레이 후 완료 처리
        setTimeout(() => {
          const backendUrl = 'http://localhost:5000';
          const result: ProcessingResult = {
            musicUrl: backendUrl + response.data.audio_url,
            title: resultTitle,
            duration: response.data.duration,
          };
          onProcessingComplete(result);
        }, 500); // 0.5초 딜레이

      } catch (err: any) {
        // 오류 발생 시 진행도 정지
        isCompleteRef.current = true;
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
        if (stepIntervalRef.current) {
          clearInterval(stepIntervalRef.current);
        }

        // 오류 메시지 추출
        let errorMessage = '알 수 없는 서버 오류가 발생했습니다.';

        if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
        } else if (!err.response && err.request) {
          errorMessage = '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.';
        } else if (err.message) {
          errorMessage = err.message;
        }

        onProcessingError(errorMessage);
      }
    };

    callAPI();

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (stepIntervalRef.current) {
        clearInterval(stepIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 컴포넌트 마운트 시 한 번만 실행

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
