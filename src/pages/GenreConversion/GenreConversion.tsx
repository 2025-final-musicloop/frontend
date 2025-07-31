import React from 'react';
import ProcessFlow from '../../components/common/ProcessFlow';
import AudioUpload from './components/AudioUpload';
import DetailSelection from './components/DetailSelection';
import ProcessingPage from './components/ProcessingPage';
import CompletionPage from './components/CompletionPage';

export interface MusicDetails {
  genre?: string;
  mood?: string;
}

export interface ProcessingResult {
  musicUrl: string;
  title: string;
  duration: number;
}

const GenreConversion: React.FC = () => {
  return (
    <ProcessFlow
      title="장르 변환"
      description="노래를 업로드하고 원하는 장르로 변환해보세요."
      AudioUploadComponent={AudioUpload}
      DetailSelectionComponent={DetailSelection}
      ProcessingPageComponent={ProcessingPage}
      CompletionPageComponent={CompletionPage}
    />
  );
};

export default GenreConversion;
