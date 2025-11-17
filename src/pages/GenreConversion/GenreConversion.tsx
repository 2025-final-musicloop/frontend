// src/pages/GenreConversion/GenreConversion.tsx

import React, { useState } from 'react';
import axios from 'axios';
import AudioUpload from '../Huming/components/AudioUpload';
import ProcessingPage from '../Huming/components/ProcessingPage';
import CompletionPage from './components/CompletionPage';
// --- 타입 정의 (이전과 동일) ---
interface ApiResponse {
  status: string;
  audio_url: string;
  duration: number;
  error_type?: string;
}
interface ProcessingResult {
  musicUrl: string;
  title: string;
  duration: number;
}
interface MusicDetails {
  genre?: string;
  mood?: string;
  customPrompt?: string;
}

// --- 장르/분위기 선택 (+ 직접 입력) 컴포넌트 (이전과 동일) ---
// (이 컴포넌트는 별도의 파일로 분리하거나 여기에 그대로 두어도 됩니다)
const GenreDetailSelection: React.FC<{ onSubmit: (details: MusicDetails) => void }> = ({ onSubmit }) => {
  const [selectedGenre, setSelectedGenre] = useState('Rock');
  const [customGenre, setCustomGenre] = useState('');
  const [selectedMood, setSelectedMood] = useState('Energetic and powerful');
  const [customMood, setCustomMood] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  const genres = ['Rock', 'Jazz', 'Cinematic', 'Electronic', 'Pop Ballad', '-- 직접 입력 --'];
  const moods = [
    'Energetic and powerful',
    'Happy and uplifting',
    'Sad and emotional',
    'Calm and relaxing',
    '-- 직접 입력 --',
  ];

  const handleSubmit = () => {
    const finalGenre = selectedGenre === '-- 직접 입력 --' ? customGenre : selectedGenre;
    const finalMood = selectedMood === '-- 직접 입력 --' ? customMood : selectedMood;
    if (finalGenre.trim() === '') {
      alert('장르를 선택하거나 입력해주세요.');
      return;
    }
    if (finalMood.trim() === '') {
      alert('분위기를 선택하거나 입력해주세요.');
      return;
    }
    onSubmit({ genre: finalGenre, mood: finalMood, customPrompt: customPrompt });
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-lg flex-col items-center justify-center rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-4 text-3xl font-bold text-blue-600">변환할 스타일 선택</h1>
      <p className="mb-8 text-gray-600">업로드한 음악을 어떤 스타일로 바꾸고 싶으신가요?</p>

      {/* 장르 선택 */}
      <div className="mb-6 w-full">
        <label className="mb-1 block text-sm font-medium text-gray-700">장르</label>
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        {selectedGenre === '-- 직접 입력 --' && (
          <input
            type="text"
            value={customGenre}
            onChange={(e) => setCustomGenre(e.target.value)}
            placeholder="원하는 장르를 직접 입력하세요"
            className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        )}
      </div>

      {/* 분위기 선택 */}
      <div className="mb-6 w-full">
        <label className="mb-1 block text-sm font-medium text-gray-700">분위기</label>
        <select
          value={selectedMood}
          onChange={(e) => setSelectedMood(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {moods.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        {selectedMood === '-- 직접 입력 --' && (
          <input
            type="text"
            value={customMood}
            onChange={(e) => setCustomMood(e.target.value)}
            placeholder="원하는 분위기를 직접 입력하세요"
            className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        )}
      </div>

      {/* 추가 요청사항 */}
      <div className="mb-8 w-full">
        <label className="mb-1 block text-sm font-medium text-gray-700">추가 요청사항 (선택사항)</label>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="예시: '일렉 기타 솔로를 길게 넣어줘'"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-700"
      >
        🎶 장르 변환하기
      </button>
    </div>
  );
};

// --- 메인 GenreConversion 컴포넌트 ---
const GenreConversion: React.FC = () => {
  // 상태 관리 및 핸들러 함수들은 이전과 동일합니다.
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
    setCurrentStep(3);
    setProcessingError(''); // 에러 상태 초기화

    if (!uploadedAudioFile) {
      setProcessingError('오류: 오디오 파일이 없습니다.');
      setCurrentStep(4);
      return;
    }
    const formData = new FormData();
    formData.append('audio', uploadedAudioFile);
    formData.append('genre', details.genre || 'Rock');
    formData.append('mood', details.mood || 'Energetic');
    formData.append('custom_prompt', details.customPrompt || '');

    try {
      const response = await axios.post<ApiResponse>('http://localhost:5000/convert-genre', formData);
      const backendUrl = 'http://localhost:5000';
      const result: ProcessingResult = {
        musicUrl: backendUrl + response.data.audio_url,
        title: '장르 변환 결과',
        duration: response.data.duration,
      };
      setCompletionResult(result);
      setCurrentStep(4);
    } catch (err: any) {
      // 디버깅 로그는 유지하는 것이 좋습니다.
      console.error('API Error Object:', err);
      if (err.response) {
        console.log('Received Error Response Data:', err.response.data);
      }

      let displayErrorMessage = '음악 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';

      // --- Recitation Check 오류만 특별히 확인 ---
      if (err.response?.data?.error_type === 'recitation_error') {
        displayErrorMessage =
          '⚠️ AI가 기존 곡과 유사한 음악을 생성하여 저작권 보호를 위해 차단되었습니다. 스타일이나 추가 요청을 조금 바꿔서 다시 시도해 주세요.';
      }
      // 그 외 모든 오류 (서버 응답 오류, 연결 실패 등)는 좀 더 일반적인 메시지 표시
      else if (err.response?.data?.error) {
        // 서버가 보낸 다른 오류 메시지가 있다면 표시
        displayErrorMessage = `오류: ${err.response.data.error}`;
      } else if (!err.response && err.request) {
        // 서버 연결 실패 시
        displayErrorMessage = '오류: 백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.';
      }
      // (다른 자잘한 오류는 기본 메시지 사용)

      // 알림 표시
      alert(`오류가 발생했습니다:\n${displayErrorMessage}`);

      // 첫 화면으로 돌아가기
      setCurrentStep(1);
      setUploadedAudioFile(null);
      setSelectedDetails({});
      setProcessingError('');
      setCompletionResult(null);
    }
  };

  const handleRegenerate = () => {
    setCurrentStep(1);
    setUploadedAudioFile(null);
    setSelectedDetails({});
    setProcessingError('');
    setCompletionResult(null);
  };

  // --- 수정된 부분: 모든 단계의 컴포넌트를 중앙 정렬 div로 감쌉니다 ---
  const renderCurrentStep = () => {
    // 모든 단계에 적용될 중앙 정렬 스타일 Wrapper
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
        return (
          <CenteredWrapper>
            <GenreDetailSelection onSubmit={handleDetailsSubmit} />
          </CenteredWrapper>
        );
      case 3:
        // ProcessingPage는 자체적으로 전체 화면을 사용하므로 Wrapper 불필요
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

export default GenreConversion;
