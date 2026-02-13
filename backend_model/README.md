# Backend Model - 반주 생성 모델

허밍 오디오를 MIDI로 변환하고 합성 오디오를 생성하는 파이프라인입니다.

## 📋 필수 요구사항

### 1. Python 패키지 설치

**주의**: 이 모델은 `backend_genre/requirements.txt`에 포함된 패키지들을 사용합니다.
별도의 `requirements.txt` 설치가 필요하지 않습니다.

필요한 주요 패키지:

- `librosa` (오디오 처리)
- `crepe` (피치 감지)
- `tensorflow` (CREPE 모델 실행)
- `pretty_midi` (MIDI 처리)
- `pyfluidsynth` (고품질 오디오 합성, 선택사항)
- `soundfile` (오디오 파일 입출력)
- `numpy` (수치 연산)

### 2. FluidSynth 설치 (선택사항, 더 나은 품질)

**Windows:**

- [FluidSynth 다운로드](https://github.com/FluidSynth/fluidsynth/releases)
- 또는 `choco install fluidsynth` (Chocolatey 사용 시)

**Linux:**

```bash
sudo apt-get install fluidsynth
# 또는
sudo yum install fluidsynth
```

**macOS:**

```bash
brew install fluidsynth
```

### 3. SoundFont 파일 (선택사항)

더 나은 음질을 위해 SoundFont 파일이 필요합니다:

- [FluidR3_GM.sf2](https://member.keymusician.com/Member/FluidR3MonoGM/SetDefault.aspx) 다운로드
- `backend_model/soundfonts/` 폴더에 저장
- Windows의 경우 기본 SoundFont (`C:\Windows\System32\drivers\gm.dls`) 자동 사용

## 📁 폴더 구조

### 필요한 폴더

**입력 폴더**: 필요 없음

- 입력 파일은 어느 위치에 있어도 됩니다
- 파일 경로를 직접 지정하면 됩니다
- 예: `python main.py C:\Users\user\music\humming.wav`

**출력 폴더**: 자동 생성됨

- 출력 폴더는 자동으로 생성됩니다 (`os.makedirs` 사용)
- 기본 출력 폴더: `../outputs` (프로젝트 루트의 `outputs` 폴더)
- 사용자 지정 폴더도 자동 생성됩니다
- 예: `python main.py input.wav --output ./my_outputs` → `my_outputs` 폴더 자동 생성

### 권장 폴더 구조 (선택사항)

편의를 위해 다음 폴더 구조를 권장합니다:

```
프로젝트 루트/
├── backend_model/
│   ├── main.py
│   ├── pitch2midi.py
│   ├── synth.py
│   └── soundfonts/          # SoundFont 파일 (선택사항)
├── data/                     # 입력 파일 저장 (선택사항)
│   └── humming_sample.wav
└── outputs/                  # 출력 파일 저장 (자동 생성)
    ├── humming_sample.mid
    └── humming_sample_synthesized.wav
```

**참고**:

- `data/` 폴더는 편의를 위한 것이며 필수는 아닙니다
- `outputs/` 폴더는 첫 실행 시 자동으로 생성됩니다
- 모든 폴더는 선택사항이며, 파일 경로를 직접 지정할 수 있습니다

## 📥 입력 형식

### 지원하는 입력 파일

- **형식**: WAV, MP3, FLAC 등 (librosa가 지원하는 모든 형식)
- **채널**: 모노 또는 스테레오 (자동으로 모노로 변환)
- **샘플링 레이트**: 자동 리샘플링 (기본 22050 Hz)
- **내용**: 허밍, 보컬, 단일 악기 연주 등 단선율 오디오
- **위치**: 어느 위치에 있어도 됩니다 (절대 경로 또는 상대 경로)

### 입력 파일 예시

```
# 상대 경로
input.wav                    # 현재 디렉토리
../data/melody.wav          # 상위 디렉토리의 data 폴더
./recordings/humming.mp3    # 현재 디렉토리의 recordings 폴더

# 절대 경로 (Windows)
C:\Users\user\music\vocals.wav

# 절대 경로 (Linux/macOS)
/home/user/music/melody.wav
```

## 📤 출력 형식

### 생성되는 파일

1. **MIDI 파일** (`.mid`)

   - 파일명: `{입력파일명}.mid`
   - 형식: Standard MIDI File (SMF)
   - 내용: 감지된 피치를 MIDI 노트로 변환
   - 악기: 지정한 MIDI 프로그램 번호로 설정

2. **합성 오디오 파일** (`.wav`)
   - 파일명: `{입력파일명}_synthesized.wav`
   - 형식: WAV (PCM)
   - 샘플링 레이트: 44100 Hz
   - 채널: 모노
   - 내용: MIDI를 오디오로 합성한 결과

### 출력 예시

```
입력: humming_sample.wav
출력:
  - humming_sample.mid              (MIDI 파일)
  - humming_sample_synthesized.wav  (합성 오디오)
```

## 🎹 사용 가능한 악기

### MIDI 프로그램 번호 (0-127)

이 모델은 표준 MIDI 프로그램 번호를 사용합니다. 총 128개의 악기를 사용할 수 있으며, 주요 악기들은 다음과 같습니다:

#### 피아노 (0-7)

- `0` - Acoustic Grand Piano (기본값)
- `1` - Bright Acoustic Piano
- `2` - Electric Grand Piano
- `3` - Honky-tonk Piano
- `4` - Electric Piano 1
- `5` - Electric Piano 2
- `6` - Harpsichord
- `7` - Clavi

#### 기타 (24-31)

- `24` - Acoustic Guitar (nylon)
- `25` - Acoustic Guitar (steel)
- `26` - Electric Guitar (jazz)
- `27` - Electric Guitar (clean)
- `28` - Electric Guitar (muted)
- `29` - Overdriven Guitar
- `30` - Distortion Guitar
- `31` - Guitar Harmonics

#### 현악기 (40-47)

- `40` - Violin
- `41` - Viola
- `42` - Cello
- `43` - Contrabass
- `44` - Tremolo Strings
- `45` - Pizzicato Strings
- `46` - Orchestral Harp
- `47` - Timpani

#### 금관악기 (56-63)

- `56` - Trumpet
- `57` - Trombone
- `58` - Tuba
- `59` - Muted Trumpet
- `60` - French Horn
- `61` - Brass Section
- `62` - Synth Brass 1
- `63` - Synth Brass 2

#### 목관악기 (64-79)

- `64` - Soprano Sax
- `65` - Alto Sax
- `66` - Tenor Sax
- `67` - Baritone Sax
- `68` - Oboe
- `69` - English Horn
- `70` - Bassoon
- `71` - Clarinet
- `72` - Piccolo
- `73` - Flute
- `74` - Recorder
- `75` - Pan Flute
- `76` - Blown Bottle
- `77` - Shakuhachi
- `78` - Whistle
- `79` - Ocarina

#### 기타 악기

- `19` - Church Organ
- `22` - Harmonica
- `88` - Lead 1 (square)
- `89` - Lead 2 (sawtooth)
- `90` - Lead 3 (calliope)
- `91` - Lead 4 (chiff)
- `92` - Lead 5 (charang)
- `93` - Lead 6 (voice)
- `94` - Lead 7 (fifths)
- `95` - Lead 8 (bass + lead)

### 사전 정의된 악기 프리셋

`config.py`에 정의된 악기 이름으로도 사용 가능:

```python
INSTRUMENT_PRESETS = {
    "piano": 0,
    "guitar_nylon": 24,
    "guitar_steel": 25,
    "violin": 40,
    "viola": 41,
    "cello": 42,
    "trumpet": 56,
    "trombone": 57,
    "flute": 73,
    "recorder": 74,
    "organ": 19,
    "harmonica": 22,
    "saxophone": 64,
    "clarinet": 71,
}
```

## 🚀 실행 방법

### 방법 1: 명령줄 실행 (CLI)

#### 기본 사용법

```bash
# 기본 실행 (피아노, 기본 설정)
python main.py input.wav

# 악기 지정
python main.py input.wav --instrument 40        # 바이올린
python main.py input.wav --instrument 73        # 플루트
python main.py input.wav --instrument 56         # 트럼펫

# 출력 디렉토리 지정
python main.py input.wav --output ./my_outputs

# 신뢰도 임계값 조정 (0.0-1.0)
python main.py input.wav --confidence 0.6        # 더 엄격한 필터링
python main.py input.wav --confidence 0.3       # 더 많은 노트 감지

# SoundFont 파일 지정
python main.py input.wav --soundfont ./soundfonts/FluidR3_GM.sf2

# pretty_midi 합성 사용 (FluidSynth 비활성화)
python main.py input.wav --no-fluidsynth

# 사용 가능한 악기 목록 보기
python main.py --list-instruments
```

#### 명령줄 옵션 전체 목록

```
positional arguments:
  input                 Input humming audio file (WAV format)

optional arguments:
  -h, --help            도움말 표시
  --output OUTPUT, -o OUTPUT
                        Output directory (default: ../outputs)
  --instrument INSTRUMENT, -i INSTRUMENT
                        MIDI instrument program number (0-127, default: 0)
  --confidence CONFIDENCE, -c CONFIDENCE
                        Minimum confidence threshold (0.0-1.0, default: 0.5)
  --soundfont SOUNDFONT, -s SOUNDFONT
                        Path to SoundFont (.sf2) file
  --no-fluidsynth       Use pretty_midi synthesis instead of FluidSynth
  --list-instruments    List available MIDI instruments and exit
```

### 방법 2: Python 라이브러리로 사용

#### 기본 사용

```python
from main import HumToMusicPipeline

# 파이프라인 초기화
pipeline = HumToMusicPipeline()

# 허밍 처리
result = pipeline.process_humming(
    input_audio_path="input.wav",
    output_dir="./outputs",
    instrument_program=0,        # 피아노
    confidence_threshold=0.5
)

if result.get("success"):
    print(f"MIDI: {result['midi_path']}")
    print(f"Audio: {result['audio_path']}")
else:
    print(f"Error: {result.get('error')}")
```

#### 다양한 악기로 처리

```python
from main import HumToMusicPipeline
from config import INSTRUMENT_PRESETS

pipeline = HumToMusicPipeline()

# 바이올린으로 변환
result = pipeline.process_humming(
    input_audio_path="melody.wav",
    output_dir="./outputs/violin",
    instrument_program=INSTRUMENT_PRESETS["violin"],
    confidence_threshold=0.5
)

# 플루트로 변환
result = pipeline.process_humming(
    input_audio_path="melody.wav",
    output_dir="./outputs/flute",
    instrument_program=INSTRUMENT_PRESETS["flute"],
    confidence_threshold=0.5
)
```

#### 배치 처리

```python
from main import HumToMusicPipeline
import os

pipeline = HumToMusicPipeline()
input_files = ["melody1.wav", "melody2.wav", "melody3.wav"]
instruments = [0, 40, 73]  # Piano, Violin, Flute

for input_file, instrument in zip(input_files, instruments):
    if os.path.exists(input_file):
        result = pipeline.process_humming(
            input_audio_path=input_file,
            output_dir=f"./outputs/{instrument}",
            instrument_program=instrument,
            confidence_threshold=0.5
        )
        if result.get("success"):
            print(f"✅ {input_file} → {result['audio_path']}")
```

#### 개별 컴포넌트 사용

```python
from pitch2midi import HummingToMIDI
from synth import MIDISynthesizer

# 1단계: 오디오 → MIDI
pitch_converter = HummingToMIDI(sample_rate=22050)
midi_path = pitch_converter.convert_audio_to_midi(
    audio_path="input.wav",
    output_path="output.mid",
    confidence_threshold=0.5,
    instrument_program=40  # Violin
)

# 2단계: MIDI → 오디오
synthesizer = MIDISynthesizer(sample_rate=44100)
audio_path = synthesizer.synthesize_midi(
    midi_path="output.mid",
    output_path="output.wav",
    use_fluidsynth=True
)
```

### 방법 3: Flask API로 통합

`backend_genre/server.py`에 통합하여 사용할 수 있습니다.

## 🔧 설정

### config.py 설정 옵션

`config.py`에서 다음을 설정할 수 있습니다:

#### 오디오 처리 설정

```python
AUDIO_CONFIG = {
    "sample_rate": 22050,              # 피치 감지 샘플링 레이트
    "synthesis_sample_rate": 44100,    # 합성 오디오 샘플링 레이트
    "hop_length": 512,                 # 오디오 분석 hop length
    "confidence_threshold": 0.5,        # 기본 신뢰도 임계값
}
```

#### CREPE 설정

```python
CREPE_CONFIG = {
    "model_capacity": "medium",         # 'tiny', 'small', 'medium', 'large', 'full'
    "viterbi": True,                    # Viterbi 스무딩 사용
    "step_size": 10,                    # 밀리초 단위 스텝 크기
}
```

#### MIDI 설정

```python
MIDI_CONFIG = {
    "default_velocity": 80,             # 기본 노트 속도 (0-127)
    "default_instrument": 0,            # 기본 악기 (0 = 피아노)
    "note_duration_min": 0.1,          # 최소 노트 길이 (초)
}
```

#### 품질 프리셋

```python
# 빠른 처리 (낮은 품질)
"fast": {
    "crepe_model": "tiny",
    "sample_rate": 16000,
    "confidence_threshold": 0.6,
}

# 균형잡힌 설정 (기본값)
"balanced": {
    "crepe_model": "medium",
    "sample_rate": 22050,
    "confidence_threshold": 0.5,
}

# 고품질 (느린 처리)
"high_quality": {
    "crepe_model": "full",
    "sample_rate": 44100,
    "confidence_threshold": 0.4,
}
```

## 📊 처리 파이프라인

### 단계별 처리 과정

1. **오디오 로딩**

   - 입력: 오디오 파일 (WAV, MP3 등)
   - 처리: librosa로 로드, 모노 변환, 리샘플링
   - 출력: numpy 배열 (오디오 샘플)

2. **피치 감지**

   - 입력: 오디오 샘플
   - 처리: CREPE 모델로 피치 추출
   - 출력: 시간 스탬프, 주파수, 신뢰도 배열

3. **MIDI 변환**

   - 입력: 주파수 및 신뢰도 배열
   - 처리: 주파수 → MIDI 노트 번호 변환, 신뢰도 필터링
   - 출력: MIDI 노트 배열

4. **MIDI 파일 생성**

   - 입력: MIDI 노트 배열, 악기 프로그램 번호
   - 처리: pretty_midi로 MIDI 파일 생성
   - 출력: `.mid` 파일

5. **오디오 합성**
   - 입력: MIDI 파일
   - 처리: FluidSynth 또는 pretty_midi로 오디오 합성
   - 출력: `.wav` 파일

## ⚠️ 주의사항

1. **TensorFlow 필요**: CREPE는 TensorFlow를 사용하므로 설치 필요
2. **SoundFont 없이도 동작**: FluidSynth가 없으면 pretty_midi의 기본 합성 사용 (품질 저하)
3. **메모리 사용량**: 큰 모델(full)은 많은 메모리 필요 (권장: medium)
4. **단선율 처리**: 복잡한 화음이나 다중 악기는 단일 악기로 변환됨
5. **신뢰도 임계값**: 너무 낮으면 노이즈가 노트로 감지될 수 있음

## 📝 실행 검증 체크리스트

- [ ] Python 3.8+ 설치됨
- [ ] `backend_genre/requirements.txt`의 패키지 설치 완료
- [ ] 테스트 오디오 파일 준비 (WAV 형식, 어느 위치든 가능)
- [ ] 출력 디렉토리 생성 권한 확인 (자동 생성되지만 권한 필요)
- [ ] (선택) FluidSynth 설치됨
- [ ] (선택) SoundFont 파일 다운로드됨
- [ ] (선택) `data/` 폴더 생성 (편의를 위해)

## 🧪 테스트 실행

```bash
# 테스트 오디오 생성
python create_test_audio.py

# 생성된 테스트 파일로 실행
python main.py ../data/test_humming.wav

# 다양한 악기로 테스트
python main.py ../data/test_humming.wav --instrument 40  # Violin
python main.py ../data/test_humming.wav --instrument 73  # Flute
python main.py ../data/test_humming.wav --instrument 56  # Trumpet
```

## 📚 추가 예제

더 많은 사용 예제는 `example_api.py`를 참고하세요:

```bash
python example_api.py
```

이 파일에는 다음 예제들이 포함되어 있습니다:

- 기본 사용법
- 배치 처리
- 품질 비교
- API 통합
- 커스텀 파이프라인
