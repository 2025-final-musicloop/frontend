# FluidSynth 사용 가이드

## FluidSynth를 사용하려면 필요한 것

### 1. pyfluidsynth Python 패키지 설치 (필수)

```bash
pip install pyfluidsynth
```

또는 `backend_genre/requirements.txt`에 이미 포함되어 있으므로:

```bash
pip install -r backend_genre/requirements.txt
```

### 2. SoundFont 파일 (필수)

FluidSynth는 SoundFont 파일이 필요합니다. 다음 중 하나를 준비하세요:

#### Windows (자동 감지)

- `C:\Windows\System32\drivers\gm.dls` - Windows 기본 SoundFont (자동 사용)

#### 수동 설치 (더 나은 품질)

1. [FluidR3_GM.sf2 다운로드](https://member.keymusician.com/Member/FluidR3MonoGM/SetDefault.aspx)
2. `backend_model/soundfonts/` 폴더에 저장
3. 또는 프로젝트 루트에 저장

### 3. FluidSynth 바이너리 (선택사항)

**중요**: `pyfluidsynth`만 설치하면 됩니다. 별도의 FluidSynth 바이너리 설치가 필수는 아닙니다.

만약 C:\tools에 FluidSynth가 있다면:

- PATH 환경 변수에 추가하면 pyfluidsynth가 찾을 수 있습니다
- 하지만 pyfluidsynth 자체에 FluidSynth 라이브러리가 포함되어 있어서 보통 필요 없습니다

## 확인 방법

### 1. pyfluidsynth 설치 확인

```bash
python -c "import fluidsynth; print('OK: pyfluidsynth 설치됨')"
```

### 2. SoundFont 확인

```bash
python backend_model/check_setup.py
```

또는 직접 확인:

```python
from backend_model.synth import MIDISynthesizer
import os

synthesizer = MIDISynthesizer()
if synthesizer.soundfont_path and os.path.exists(synthesizer.soundfont_path):
    print(f"SoundFont 발견: {synthesizer.soundfont_path}")
else:
    print("SoundFont 없음")
```

## 사용 방법

### 기본 사용 (자동으로 FluidSynth 사용)

```bash
python backend_model/main.py input.wav
```

코드가 자동으로:

1. pyfluidsynth가 설치되어 있는지 확인
2. SoundFont 파일을 찾음
3. 모두 있으면 FluidSynth 사용, 없으면 pretty_midi 사용

### FluidSynth 강제 사용

```python
from backend_model.main import HumToMusicPipeline

pipeline = HumToMusicPipeline()
result = pipeline.process_humming(
    input_audio_path="input.wav",
    output_dir="./outputs",
    use_fluidsynth=True  # 기본값
)
```

### FluidSynth 비활성화 (pretty_midi 사용)

```bash
python backend_model/main.py input.wav --no-fluidsynth
```

또는:

```python
result = pipeline.process_humming(
    input_audio_path="input.wav",
    use_fluidsynth=False
)
```

## 문제 해결

### "FluidSynth not available" 오류

1. **pyfluidsynth 설치 확인**

   ```bash
   pip list | findstr pyfluidsynth
   ```

2. **재설치**
   ```bash
   pip uninstall pyfluidsynth
   pip install pyfluidsynth
   ```

### "SoundFont file not found" 오류

1. **Windows 기본 SoundFont 확인**

   ```bash
   Test-Path C:\Windows\System32\drivers\gm.dls
   ```

2. **SoundFont 다운로드 및 설치**
   - [FluidR3_GM.sf2 다운로드](https://member.keymusician.com/Member/FluidR3MonoGM/SetDefault.aspx)
   - `backend_model/soundfonts/` 폴더 생성
   - 다운로드한 파일을 해당 폴더에 저장

### C:\tools의 FluidSynth 사용하기

**중요**: pyfluidsynth는 시스템에 설치된 FluidSynth 라이브러리(DLL)를 찾아서 사용합니다.

만약 C:\tools에 FluidSynth가 있다면:

1. **PATH 환경 변수에 추가** (권장)

   **임시 설정 (현재 세션만):**

   ```powershell
   $env:PATH += ";C:\tools\fluidsynth\bin"
   # 또는 FluidSynth DLL이 있는 정확한 경로
   $env:PATH += ";C:\tools"
   ```

   **영구 설정 (시스템 환경 변수):**

   - Windows 설정 → 시스템 → 고급 시스템 설정 → 환경 변수
   - 시스템 변수에서 `Path` 선택 → 편집
   - `C:\tools\fluidsynth\bin` 추가 (또는 FluidSynth DLL이 있는 경로)

2. **확인 방법**

   ```powershell
   # FluidSynth DLL 찾기
   Get-ChildItem C:\tools -Recurse -Filter "fluidsynth.dll" -ErrorAction SilentlyContinue
   ```

3. **pyfluidsynth 설치 후 확인**
   ```bash
   pip install pyfluidsynth
   python backend_model/check_fluidsynth_lib.py
   ```

**참고**:

- pyfluidsynth는 설치 시 시스템의 FluidSynth DLL을 찾습니다
- PATH에 경로가 없으면 pyfluidsynth가 DLL을 찾지 못할 수 있습니다
- 일부 pyfluidsynth 버전은 내장 라이브러리를 포함하지만, 일반적으로는 시스템 라이브러리를 사용합니다

## 코드 동작 방식

`synth.py`의 `synthesize_midi` 메서드는 다음 순서로 동작합니다:

1. `use_fluidsynth=True`이고
2. `fluidsynth` 모듈이 import 가능하고 (`pyfluidsynth` 설치됨)
3. `soundfont_path`가 존재하면
   → **FluidSynth 사용** ✅

그렇지 않으면:
→ **pretty_midi 기본 합성 사용** (품질 저하)

## 요약

**FluidSynth를 사용하려면:**

1. ✅ `pip install pyfluidsynth` (또는 requirements.txt 설치)
2. ✅ SoundFont 파일 준비 (Windows 기본 또는 다운로드)
3. ✅ 코드는 자동으로 FluidSynth 사용 시도

**C:\tools의 FluidSynth:**

- pyfluidsynth만 설치하면 됩니다
- 별도의 바이너리 설정이 필수는 아닙니다
- pyfluidsynth가 내부적으로 FluidSynth 라이브러리를 사용합니다
