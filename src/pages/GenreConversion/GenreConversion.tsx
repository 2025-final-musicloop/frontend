// src/pages/GenreConversion/GenreConversion.tsx

import React, { useState } from 'react';
import axios from 'axios';

// 각 단계별 컴포넌트들을 임포트합니다.
// (이 컴포넌트들은 Huming 페이지와 공유하여 사용할 수 있습니다.)
import AudioUpload from '../Huming/components/AudioUpload';
import ProcessingPage from '../Huming/components/ProcessingPage';
import CompletionPage from '../Huming/components/CompletionPage';

// --- 타입 정의 ---
// 공통 타입 파일(src/types/index.d.ts)에서 가져오는 것이 가장 이상적입니다.
interface ApiResponse {
  status: string;
  audio_url: string;
  duration: number;
}
interface ProcessingResult {
  musicUrl: string;
  title: string;
  duration: number;
}
interface MusicDetails {
  genre?: string;
  mood?: string;
}

// --- 장르/분위기 선택을 위한 전용 컴포넌트 ---
const GenreDetailSelection: React.FC<{ onSubmit: (details: MusicDetails) => void }> = ({ onSubmit }) => {
  const [genre, setGenre] = useState('Rock');
  const [mood, setMood] = useState('Energetic and powerful');

  const handleSubmit = () => {
    onSubmit({ genre, mood });
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2em', marginBottom: '20px' }}>변환할 스타일 선택</h1>
      <p style={{ marginBottom: '30px' }}>업로드한 음악을 어떤 스타일로 바꾸고 싶으신가요?</p>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}><b>장르</b></label>
        <select value={genre} onChange={(e) => setGenre(e.target.value)} style={{ width: '100%', padding: '10px' }}>
          <option>Rock</option>
          <option>Jazz</option>
          <option>Cinematic</option>
          <option>Electronic</option>
          <option>Pop Ballad</option>
        </select>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}><b>분위기</b></label>
        <select value={mood} onChange={(e) => setMood(e.target.value)} style={{ width: '100%', padding: '10px' }}>
          <option>Energetic and powerful</option>
          <option>Happy and uplifting</option>
          <option>Sad and emotional</option>
          <option>Calm and relaxing</option>
        </select>
      </div>
      
      <button onClick={handleSubmit} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
        🎶 장르 변환하기
      </button>
    </div>
  );
};


// --- 메인 GenreConversion 컴포넌트 (Huming.tsx와 거의 동일한 구조) ---
const GenreConversion: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedAudioFile, setUploadedAudioFile] = useState<File | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<MusicDetails>({});
  const [processingError, setProcessingError] = useState('');
  const [completionResult, setCompletionResult] = useState<ProcessingResult | null>(null);

  const handleAudioUpload = (file: File) => {
    setUploadedAudioFile(file);
    setCurrentStep(2);
  };

  const handleDetailsSubmit = async (details: MusicDetails) => {
    setSelectedDetails(details);
    setCurrentStep(3); // 처리 중 화면으로 즉시 이동

    if (!uploadedAudioFile) {
      setProcessingError("오류: 오디오 파일이 없습니다.");
      setCurrentStep(4);
      return;
    }

    const formData = new FormData();
    formData.append('audio', uploadedAudioFile);
    formData.append('genre', details.genre || 'Rock');
    formData.append('mood', details.mood || 'Energetic');

    try {
      // --- 여기가 수정되었습니다: API 호출 주소를 '/convert-genre'로 변경 ---
      const response = await axios.post<ApiResponse>('http://localhost:5000/convert-genre', formData);
      
      const backendUrl = 'http://localhost:5000';
      const result: ProcessingResult = {
        musicUrl: backendUrl + response.data.audio_url,
        title: "장르 변환 결과",
        duration: response.data.duration
      };
      setCompletionResult(result);
      setCurrentStep(4);

    } catch (err: any) {
      const errorMessage = err.response?.data?.error || '알 수 없는 서버 오류가 발생했습니다.';
      setProcessingError(errorMessage);
      setCurrentStep(4);
    }
  };
  
  const handleRegenerate = () => {
    setCurrentStep(1);
    setUploadedAudioFile(null);
    setSelectedDetails({});
    setProcessingError('');
    setCompletionResult(null);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <AudioUpload onAudioUpload={handleAudioUpload} />;
      case 2:
        return <GenreDetailSelection onSubmit={handleDetailsSubmit} />;
      case 3:
        return <ProcessingPage onProcessingComplete={() => {}} />;
      case 4:
        if (processingError) {
          return <CompletionPage onRegenerate={handleRegenerate} result={{musicUrl: '', title: `오류: ${processingError}`, duration: 0}} details={selectedDetails} />;
        }
        return <CompletionPage onRegenerate={handleRegenerate} result={completionResult!} details={selectedDetails} />;
      default:
        return <AudioUpload onAudioUpload={handleAudioUpload} />;
    }
  };

  return (
    <div>
      {renderCurrentStep()}
    </div>
  );
};

export default GenreConversion;