import { useState, useEffect } from 'react';
import { MusicLoop, MusicLoopFormData } from '../../types/mypage';
import { getMyLoops, createLoop, updateLoop, deleteLoop } from '../../api/mypage';
import styles from './MyPage.module.css';

interface MyLoopsSectionProps {
  onLoopChange: () => void;
}

const MyLoopsSection = ({ onLoopChange }: MyLoopsSectionProps) => {
  const [loops, setLoops] = useState<MusicLoop[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // 필터
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [publicFilter, setPublicFilter] = useState<boolean | ''>('');

  // 루프 생성/수정 모달
  const [showModal, setShowModal] = useState(false);
  const [editingLoop, setEditingLoop] = useState<MusicLoop | null>(null);
  const [formData, setFormData] = useState<MusicLoopFormData>({
    title: '',
    description: '',
    bpm: undefined,
    genre: '',
    is_public: true,
  });

  useEffect(() => {
    loadLoops();
  }, []);

  const loadLoops = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (genreFilter) params.genre = genreFilter;
      if (publicFilter !== '') params.is_public = publicFilter;

      const response = await getMyLoops(params);
      setLoops(response.results || []);
    } catch (err: any) {
      setMessage('루프를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    loadLoops();
  };

  const handleOpenModal = (loop?: MusicLoop) => {
    if (loop) {
      setEditingLoop(loop);
      setFormData({
        title: loop.title,
        description: loop.description,
        bpm: loop.bpm || undefined,
        genre: loop.genre,
        is_public: loop.is_public,
      });
    } else {
      setEditingLoop(null);
      setFormData({
        title: '',
        description: '',
        bpm: undefined,
        genre: '',
        is_public: true,
      });
    }
    setShowModal(true);
  };

  const handleSaveLoop = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage('');

      if (editingLoop) {
        await updateLoop(editingLoop.id, formData);
        setMessage('루프가 수정되었습니다.');
      } else {
        await createLoop(formData);
        setMessage('루프가 생성되었습니다.');
      }

      setShowModal(false);
      loadLoops();
      onLoopChange();
    } catch (err: any) {
      setMessage(err.response?.data?.error || '저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLoop = async (id: number, title: string) => {
    if (!confirm(`"${title}" 루프를 삭제하시겠습니까?`)) return;

    try {
      setLoading(true);
      setMessage('');
      await deleteLoop(id);
      setMessage('루프가 삭제되었습니다.');
      loadLoops();
      onLoopChange();
    } catch (err: any) {
      setMessage(err.response?.data?.error || '삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {message && (
        <div className={`${styles.message} ${message.includes('실패') ? styles.error : styles.success}`}>
          {message}
        </div>
      )}

      {/* 필터 및 검색 */}
      <div className={styles.controls}>
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="루프 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="text"
            placeholder="장르 필터..."
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
          />
          <select
            value={publicFilter.toString()}
            onChange={(e) =>
              setPublicFilter(e.target.value === '' ? '' : e.target.value === 'true')
            }
          >
            <option value="">전체</option>
            <option value="true">공개</option>
            <option value="false">비공개</option>
          </select>
          <button onClick={handleFilter}>필터 적용</button>
        </div>
        <button className={styles.createButton} onClick={() => handleOpenModal()}>
          + 새 루프 만들기
        </button>
      </div>

      {/* 루프 목록 */}
      {loading ? (
        <div className={styles.loading}>로딩 중...</div>
      ) : loops.length === 0 ? (
        <div className={styles.empty}>
          <p>아직 루프가 없습니다.</p>
          <button onClick={() => handleOpenModal()}>첫 루프 만들기</button>
        </div>
      ) : (
        <div className={styles.loopsGrid}>
          {loops.map((loop) => (
            <div key={loop.id} className={styles.loopCard}>
              <div className={styles.loopThumbnail}>
                {loop.thumbnail ? (
                  <img src={loop.thumbnail} alt={loop.title} />
                ) : (
                  <div className={styles.thumbnailPlaceholder}>🎵</div>
                )}
                {!loop.is_public && (
                  <span className={styles.privateBadge}>비공개</span>
                )}
              </div>
              <div className={styles.loopInfo}>
                <h3>{loop.title}</h3>
                {loop.description && <p>{loop.description}</p>}
                <div className={styles.loopMeta}>
                  {loop.genre && <span>{loop.genre}</span>}
                  {loop.bpm && <span>{loop.bpm} BPM</span>}
                </div>
                <div className={styles.loopStats}>
                  <span>▶ {loop.play_count}</span>
                  <span>❤ {loop.favorites_count}</span>
                </div>
              </div>
              <div className={styles.loopActions}>
                <button onClick={() => handleOpenModal(loop)}>수정</button>
                <button
                  onClick={() => handleDeleteLoop(loop.id, loop.title)}
                  className={styles.delete}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 루프 생성/수정 모달 */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>{editingLoop ? '루프 수정' : '새 루프 만들기'}</h2>
            <form onSubmit={handleSaveLoop}>
              <div className={styles.formGroup}>
                <label>제목 *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>설명</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>BPM</label>
                  <input
                    type="number"
                    value={formData.bpm || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bpm: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>장르</label>
                  <input
                    type="text"
                    value={formData.genre}
                    onChange={(e) =>
                      setFormData({ ...formData, genre: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>오디오 파일 {!editingLoop && '*'}</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) =>
                    setFormData({ ...formData, audio_file: e.target.files?.[0] })
                  }
                  required={!editingLoop}
                />
              </div>
              <div className={styles.formGroup}>
                <label>썸네일 이미지</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, thumbnail: e.target.files?.[0] })
                  }
                />
              </div>
              <div className={`${styles.formGroup} ${styles.checkbox}`}>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.is_public}
                    onChange={(e) =>
                      setFormData({ ...formData, is_public: e.target.checked })
                    }
                  />
                  공개
                </label>
              </div>
              <div className={styles.formActions}>
                <button type="submit" disabled={loading}>
                  {loading ? '저장 중...' : '저장'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLoopsSection;
