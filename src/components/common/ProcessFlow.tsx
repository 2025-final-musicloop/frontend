import React, { useState } from 'react';
import styles from './ProcessFlow.module.css';

export interface MusicDetails {
  genre?: string;
  mood?: string;
  instrument?: string;
}

export interface ProcessingResult {
  musicUrl: string;
  title: string;
  duration: number;
}

export type Step = 'upload' | 'details' | 'processing' | 'completion';

interface ProcessFlowProps {
  title: string;
  description: string;
  AudioUploadComponent: React.ComponentType<{ onAudioUpload: (file: File) => void }>;
  DetailSelectionComponent: React.ComponentType<{ onDetailsSubmit: (details: MusicDetails) => void }>;
  ProcessingPageComponent: React.ComponentType<{ onProcessingComplete: (result: ProcessingResult) => void }>;
  CompletionPageComponent: React.ComponentType<{
    onRegenerate: () => void;
    result?: ProcessingResult;
    audioFile?: File;
    details: MusicDetails;
  }>;
}

const ProcessFlow: React.FC<ProcessFlowProps> = ({
  title,
  description,
  AudioUploadComponent,
  DetailSelectionComponent,
  ProcessingPageComponent,
  CompletionPageComponent,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<MusicDetails>({});
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);

  const handleAudioUpload = (file: File) => {
    setSelectedFile(file);
    setCurrentStep('details');
  };

  const handleDetailsSubmit = (details: MusicDetails) => {
    setSelectedDetails(details);
    setCurrentStep('processing');
  };

  const handleProcessingComplete = (result: ProcessingResult) => {
    setProcessingResult(result);
    setCurrentStep('completion');
  };

  const handleRegenerate = () => {
    setCurrentStep('details');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {currentStep === 'upload' && (
          <>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.description}>{description}</p>
          </>
        )}

        {currentStep === 'upload' && <AudioUploadComponent onAudioUpload={handleAudioUpload} />}

        {currentStep === 'details' && <DetailSelectionComponent onDetailsSubmit={handleDetailsSubmit} />}

        {currentStep === 'processing' && <ProcessingPageComponent onProcessingComplete={handleProcessingComplete} />}

        {currentStep === 'completion' && (
          <CompletionPageComponent
            onRegenerate={handleRegenerate}
            result={processingResult || undefined}
            audioFile={selectedFile || undefined}
            details={selectedDetails}
          />
        )}
      </div>
    </div>
  );
};

export default ProcessFlow;
