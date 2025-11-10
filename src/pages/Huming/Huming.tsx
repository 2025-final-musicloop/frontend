import React from 'react';
import ProcessFlow from '../../components/common/ProcessFlow';
import AudioUpload from './components/AudioUpload';
import DetailSelection from './components/DetailSelection';
import ProcessingPage from './components/ProcessingPage';
import CompletionPage from './components/CompletionPage';

const Huming: React.FC = () => {
  return (
    <ProcessFlow
      title="허밍으로 음악 만들기"
      description="30초 이내의 음성 파일을 업로드하고 AI가 당신만의 음악을 만들어드립니다."
      AudioUploadComponent={AudioUpload}
      DetailSelectionComponent={DetailSelection}
      ProcessingPageComponent={ProcessingPage}
      CompletionPageComponent={CompletionPage}
    />
  );
};

export default Huming;
