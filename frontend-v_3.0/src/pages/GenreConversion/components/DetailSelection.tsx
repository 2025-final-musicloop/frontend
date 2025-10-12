import React, { useState } from 'react';
import { MusicDetails } from '../../../components/common/ProcessFlow';
import styles from './DetailSelection.module.css';

interface DetailSelectionProps {
  onDetailsSubmit: (details: MusicDetails) => void;
}

const DetailSelection: React.FC<DetailSelectionProps> = ({ onDetailsSubmit }) => {
  const [selectedDetails, setSelectedDetails] = useState<MusicDetails>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const genres = [
    '선택안함',
    '팝',
    '록',
    '재즈',
    '클래식',
    '힙합',
    'R&B',
    '일렉트로닉',
    '컨트리',
    '레게',
    '블루스',
    '펑크',
    '메탈',
    '소울',
    '디스코',
  ];
  const moods = [
    '선택안함',
    '신나는',
    '우울한',
    '로맨틱한',
    '긴장감 있는',
    '평온한',
    '활기찬',
    '어두운',
    '밝은',
    '드라마틱한',
    '재미있는',
    '우아한',
    '강렬한',
    '부드러운',
    '강한',
  ];

  const handleSelection = (category: keyof MusicDetails, value: string) => {
    setSelectedDetails((prev) => ({
      ...prev,
      [category]: value === '선택안함' ? undefined : value,
    }));
    setOpenDropdown(null);
  };

  const handleCreate = () => {
    onDetailsSubmit(selectedDetails);
  };

  const toggleDropdown = (category: string) => {
    setOpenDropdown(openDropdown === category ? null : category);
  };

  const getDisplayValue = (category: keyof MusicDetails) => {
    const value = selectedDetails[category];
    return value || '선택안함';
  };

  // 임시 테스트 함수들
  const handleTestWithSelections = () => {
    const testDetails: MusicDetails = {
      genre: '팝',
      mood: '신나는',
    };
    onDetailsSubmit(testDetails);
  };

  const handleTestWithoutSelections = () => {
    onDetailsSubmit({});
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>세부사항 선택</h1>
        <p className={styles.description}>
          원하는 장르와 분위기를 선택하세요. 선택하지 않아도 AI가 자동으로 결정합니다.
        </p>
      </div>

      <div className={styles.selectionContainer}>
        {/* Genre Selection */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>변환할 장르</h2>
          <div className={styles.dropdownContainer}>
            <button className={styles.dropdownButton} onClick={() => toggleDropdown('genre')}>
              <span>{getDisplayValue('genre')}</span>
              <span
                className={`material-icons ${styles.dropdownIcon} ${openDropdown === 'genre' ? styles.rotated : ''}`}
              >
                expand_more
              </span>
            </button>
            {openDropdown === 'genre' && (
              <div className={styles.dropdownList}>
                {genres.map((genre) => (
                  <button
                    key={genre}
                    className={`${styles.dropdownItem} ${getDisplayValue('genre') === genre ? styles.selected : ''}`}
                    onClick={() => handleSelection('genre', genre)}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mood Selection */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>분위기</h2>
          <div className={styles.dropdownContainer}>
            <button className={styles.dropdownButton} onClick={() => toggleDropdown('mood')}>
              <span>{getDisplayValue('mood')}</span>
              <span
                className={`material-icons ${styles.dropdownIcon} ${openDropdown === 'mood' ? styles.rotated : ''}`}
              >
                expand_more
              </span>
            </button>
            {openDropdown === 'mood' && (
              <div className={styles.dropdownList}>
                {moods.map((mood) => (
                  <button
                    key={mood}
                    className={`${styles.dropdownItem} ${getDisplayValue('mood') === mood ? styles.selected : ''}`}
                    onClick={() => handleSelection('mood', mood)}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.createButton} onClick={handleCreate}>
          <span className="material-icons">music_note</span>
          장르 변환하기
        </button>

        {(selectedDetails.genre || selectedDetails.mood) && (
          <div className={styles.selectedOptions}>
            <h4>선택된 옵션:</h4>
            <div className={styles.optionsList}>
              {selectedDetails.genre && <span className={styles.optionTag}>장르: {selectedDetails.genre}</span>}
              {selectedDetails.mood && <span className={styles.optionTag}>분위기: {selectedDetails.mood}</span>}
            </div>
          </div>
        )}
      </div>

      {/* 고정된 테스트 버튼들 */}
      <div className={styles.fixedTestButtons}>
        <button className={styles.testButton} onClick={handleTestWithSelections}>
          선택사항과 함께
        </button>
        <button className={styles.testButton} onClick={handleTestWithoutSelections}>
          선택사항 없이
        </button>
      </div>
    </div>
  );
};

export default DetailSelection;
