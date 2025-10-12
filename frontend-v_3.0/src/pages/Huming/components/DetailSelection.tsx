import React, { useState } from 'react';
import { MusicDetails } from '../../../components/common/ProcessFlow';
import styles from './DetailSelection.module.css';

interface DetailSelectionProps {
  onDetailsSubmit: (details: MusicDetails) => void;
}

const DetailSelection: React.FC<DetailSelectionProps> = ({ onDetailsSubmit }) => {
  const [selectedDetails, setSelectedDetails] = useState<MusicDetails>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const genres = ['선택안함', '팝', '록', '재즈', '클래식', '힙합', 'R&B', '일렉트로닉', '컨트리', '레게', '블루스'];

  const instruments = [
    '선택안함',
    '피아노',
    '기타',
    '드럼',
    '베이스',
    '바이올린',
    '트럼펫',
    '색소폰',
    '플루트',
    '오르간',
    '신디사이저',
  ];

  const moods = [
    '선택안함',
    '신나는',
    '차분한',
    '로맨틱한',
    '우울한',
    '활기찬',
    '몽환적인',
    '강렬한',
    '평화로운',
    '비밀스러운',
    '희망찬',
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
    onDetailsSubmit({
      genre: '팝',
      instrument: '피아노',
      mood: '신나는',
    });
  };

  const handleTestWithoutSelections = () => {
    onDetailsSubmit({});
  };

  const isAnySelected = Object.values(selectedDetails).some((value) => value !== undefined);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>세부사항 선택</h1>
        <p className={styles.description}>
          원하는 장르, 악기, 분위기를 선택하세요. 선택하지 않아도 AI가 자동으로 결정합니다.
        </p>
      </div>

      <div className={styles.selectionContainer}>
        {/* 장르 선택 */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>장르</h2>
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

        {/* 악기 선택 */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>악기</h2>
          <div className={styles.dropdownContainer}>
            <button className={styles.dropdownButton} onClick={() => toggleDropdown('instrument')}>
              <span>{getDisplayValue('instrument')}</span>
              <span
                className={`material-icons ${styles.dropdownIcon} ${openDropdown === 'instrument' ? styles.rotated : ''}`}
              >
                expand_more
              </span>
            </button>
            {openDropdown === 'instrument' && (
              <div className={styles.dropdownList}>
                {instruments.map((instrument) => (
                  <button
                    key={instrument}
                    className={`${styles.dropdownItem} ${
                      getDisplayValue('instrument') === instrument ? styles.selected : ''
                    }`}
                    onClick={() => handleSelection('instrument', instrument)}
                  >
                    {instrument}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 분위기 선택 */}
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
          음악 만들기
        </button>

        {isAnySelected && (
          <div className={styles.selectedInfo}>
            <h3>선택된 옵션:</h3>
            <div className={styles.selectedItems}>
              {selectedDetails.genre && <span className={styles.selectedItem}>장르: {selectedDetails.genre}</span>}
              {selectedDetails.instrument && (
                <span className={styles.selectedItem}>악기: {selectedDetails.instrument}</span>
              )}
              {selectedDetails.mood && <span className={styles.selectedItem}>분위기: {selectedDetails.mood}</span>}
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
