// src/pages/Huming/Huming.tsx

import React, { useState } from 'react';
import axios from 'axios';

// 자식 컴포넌트들을 불러옵니다.
import ModelSelection from './components/ModelSelection';
import AudioUpload from './components/AudioUpload';
import DetailSelection from './components/DetailSelection';
import ProcessingPage from './components/ProcessingPage';
import CompletionPage from './components/CompletionPage';

// --- 타입 정의: 이 부분이 오류 해결의 핵심입니다 ---

// 1. 백엔드 API 서버로부터 받을 응답(response) 데이터의 타입을 명확하게 정의합니다.
interface ApiResponse {
  status: string;
  audio_url: string;
  duration: number; // 서버가 이제 duration을 보내주기로 약속했습니다.
}

// 2. CompletionPage 컴포넌트에게 전달할 최종 결과물의 타입을 정의합니다.
interface ProcessingResult {
  musicUrl: string;
  title: string;
  duration: number;
}

// 3. DetailSelection 컴포넌트로부터 받을 사용자의 선택사항 타입을 정의합니다.
interface MusicDetails {
  genre?: string;
  mood?: string;
  instrument?: string;
  customPrompt?: string;
}

// '매니저' 역할을 하는 Huming 컴포넌트
const Huming: React.FC = () => {
  // 상태 관리 변수들
  const [currentStep, setCurrentStep] = useState(1); // 1: 모델 선택, 2: 오디오 업로드, 3: 세부사항, 4: 처리, 5: 완료
  const [selectedModelType, setSelectedModelType] = useState<'api' | 'internal' | null>(null);
  const [uploadedAudioFile, setUploadedAudioFile] = useState<File | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<MusicDetails>({});
  const [processingError, setProcessingError] = useState('');
  const [completionResult, setCompletionResult] = useState<ProcessingResult | null>(null);

  // 모델 선택 핸들러
  const handleModelSelect = (modelType: 'api' | 'internal') => {
    setSelectedModelType(modelType);
    setCurrentStep(2); // 오디오 업로드 단계로
  };

  // 오디오 업로드 핸들러
  const handleAudioUpload = (file: File) => {
    setUploadedAudioFile(file);
    setCurrentStep(3); // 세부사항 선택 단계로
  };

  const handleDetailsSubmit = (details: MusicDetails) => {
    setSelectedDetails(details);
    setCurrentStep(4); // 처리 단계로

    if (!uploadedAudioFile) {
      setProcessingError('오류: 오디오 파일이 없습니다.');
      setCurrentStep(5);
      return;
    }

    // API 호출은 ProcessingPage에서 처리하도록 변경
    // 결과는 ProcessingPage의 콜백을 통해 받음
  };

  const handleRegenerate = () => {
    setCurrentStep(1);
    setSelectedModelType(null);
    setUploadedAudioFile(null);
    setSelectedDetails({});
    setProcessingError('');
    setCompletionResult(null);
  };

  // 화면 렌더링 함수 (이전과 동일)
  const renderCurrentStep = () => {
    // --- 추가: GenreConversion 페이지와 동일한 중앙 정렬 Wrapper ---
    const CenteredWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <div className="flex min-h-screen items-center justify-center">{children}</div>
    );

    switch (currentStep) {
      case 1:
        // 모델 선택
        return (
          <CenteredWrapper>
            <ModelSelection onModelSelect={handleModelSelect} />
          </CenteredWrapper>
        );
      case 2:
        // 오디오 업로드
        return (
          <CenteredWrapper>
            <AudioUpload onAudioUpload={handleAudioUpload} modelType={selectedModelType} />
          </CenteredWrapper>
        );
      case 3:
        // 세부사항 선택
        return (
          <CenteredWrapper>
            <DetailSelection onDetailsSubmit={handleDetailsSubmit} modelType={selectedModelType} />
          </CenteredWrapper>
        );
      case 4:
        // 처리 중
        return (
          <ProcessingPage
            onProcessingComplete={(result) => {
              setCompletionResult(result);
              setCurrentStep(5);
            }}
            onProcessingError={(errorMessage) => {
              alert(`오류가 발생했습니다:\n${errorMessage}`);
              setCurrentStep(1);
              setSelectedModelType(null);
              setUploadedAudioFile(null);
              setSelectedDetails({});
              setProcessingError('');
              setCompletionResult(null);
            }}
            formData={{
              audioFile: uploadedAudioFile!,
              details: selectedDetails,
              modelType: selectedModelType || 'api',
            }}
          />
        );
      case 5:
        // 완료
        return (
          <CompletionPage
            onRegenerate={handleRegenerate}
            result={completionResult!}
            details={selectedDetails}
            audioFile={uploadedAudioFile || undefined}
          />
        );
      default:
        return (
          <CenteredWrapper>
            <ModelSelection onModelSelect={handleModelSelect} />
          </CenteredWrapper>
        );
    }
  };

  return <div>{renderCurrentStep()}</div>;
};

export default Huming;
