// src/pages/Huming/Huming.tsx

import React, { useState } from 'react';
import axios from 'axios';

// 자식 컴포넌트들을 불러옵니다.
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
  // 상태 관리 변수들 (이전과 동일)
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedAudioFile, setUploadedAudioFile] = useState<File | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<MusicDetails>({});
  const [processingError, setProcessingError] = useState('');
  const [completionResult, setCompletionResult] = useState<ProcessingResult | null>(null);

  // 이벤트 핸들러들 (이전과 동일)
  const handleAudioUpload = (file: File) => {
    setUploadedAudioFile(file);
    setCurrentStep(2);
  };

  const handleDetailsSubmit = async (details: MusicDetails) => {
    setSelectedDetails(details);
    setCurrentStep(3);

    if (!uploadedAudioFile) {
      setProcessingError('오류: 오디오 파일이 없습니다.');
      setCurrentStep(4);
      return;
    }

    const formData = new FormData();
    formData.append('audio', uploadedAudioFile);
    formData.append('genre', details.genre || 'Pop Ballad');
    formData.append('mood', details.mood || 'Happy');

    // DetailSelection은 단일 악기 선택이므로, instruments[] 대신 instrument로 보냅니다.
    // 만약 다중 선택으로 변경했다면 이 부분을 수정해야 합니다.
    formData.append('instruments[]', details.instrument || 'Piano');
    formData.append('custom_prompt', details.customPrompt || '');

    try {
      // --- 여기가 수정되었습니다 ---
      // 1. axios.post 뒤에 <ApiResponse>를 추가하여, TypeScript에게 응답 데이터의 타입을 알려줍니다.
      // 2. API 호출 주소를 '/generate-from-humming'으로 명확히 지정합니다.
      const response = await axios.post<ApiResponse>('http://localhost:5000/generate-from-humming', formData);

      const backendUrl = 'http://localhost:5000';

      // 3. 이제 TypeScript는 response.data가 ApiResponse 타입임을 알고 있으므로,
      //    오류 없이 .audio_url, .duration 속성에 안전하게 접근할 수 있습니다.
      const result: ProcessingResult = {
        musicUrl: backendUrl + response.data.audio_url,
        title: '새로운 허밍 음악',
        duration: response.data.duration,
      };

      setCompletionResult(result);
      setCurrentStep(4);
    } catch (err: any) {
      // 오류 메시지 추출
      let errorMessage = '알 수 없는 서버 오류가 발생했습니다.';

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (!err.response && err.request) {
        errorMessage = '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      // 알림 표시
      alert(`오류가 발생했습니다:\n${errorMessage}`);

      // 첫 화면으로 돌아가기
      setCurrentStep(1);
      setUploadedAudioFile(null);
      setSelectedDetails({});
      setProcessingError('');
      setCompletionResult(null);
    }
  };

  const handleRegenerate = () => {
    // (이전과 동일)
    setCurrentStep(1);
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
        return (
          <CenteredWrapper>
            <AudioUpload onAudioUpload={handleAudioUpload} />
          </CenteredWrapper>
        );
      case 2:
        // 다음 단계인 DetailSelection도 동일하게 중앙 정렬을 적용합니다.
        return (
          <CenteredWrapper>
            <DetailSelection onDetailsSubmit={handleDetailsSubmit} />
          </CenteredWrapper>
        );
      case 3:
        // ProcessingPage는 전체 화면을 사용하므로 Wrapper를 적용하지 않습니다.
        return <ProcessingPage onProcessingComplete={() => {}} />;
      case 4:
        // 오류가 있으면 첫 화면으로 이미 돌아갔으므로 여기서는 성공 케이스만 처리
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
            <AudioUpload onAudioUpload={handleAudioUpload} />
          </CenteredWrapper>
        );
    }
  };

  return <div>{renderCurrentStep()}</div>;
};

export default Huming;
