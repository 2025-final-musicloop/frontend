# AI 반주 생성 프로젝트 (AI Music Accompaniment Generator)

이 프로젝트는 사용자가 흥얼거린 멜로디를 기반으로 AI가 멋진 반주를 생성해주는 웹 애플리케이션입니다. React와 TypeScript를 사용하여 구축되었으며, Tailwind CSS를 통해 현대적인 UI를 구현합니다.

## ✨ 주요 기능

- **멜로디 인식**: 사용자의 허밍 또는 노래를 녹음하여 멜로디를 분석합니다.
- **AI 기반 반주 생성**: 분석된 멜로디에 어울리는 코드를 생성하고 다양한 장르의 반주를 만듭니다.
- **음악 편집 및 커스터마이징**: 생성된 반주를 사용자가 직접 수정하고 악기를 변경할 수 있습니다.
- **커뮤니티 공유**: 완성된 곡을 커뮤니티 게시판에 공유하고 다른 사용자들과 교류할 수 있습니다.

---

## 🛠️ 기술 스택 (Tech Stack)

- **프레임워크:** React (v18)
- **언어:** TypeScript
- **빌드 도구:** Vite
- **스타일링:** Tailwind CSS (v3) + CSS Modules
- **CSS 전처리기:** PostCSS, Autoprefixer
- **라우팅:** React Router (v6)
- **코드 포맷터:** Prettier
- **린터:** ESLint

---

## 🚀 시작 가이드 (Getting Started)

프로젝트를 로컬 환경에서 실행하려면 아래의 단계를 따르세요.

### 1. 전제 조건 (Prerequisites)

- [Node.js](https://nodejs.org/) (v18 이상 권장)
- [npm](https://www.npmjs.com/) 또는 [yarn](https://yarnpkg.com/)

### 2. 프로젝트 클론 및 설치

```bash
# 1. 이 저장소를 클론합니다.
git clone https://github.com/your-repository/music-hicc.git

# 2. 프로젝트 디렉터리로 이동합니다.
cd music-hicc

# 3. 의존성 패키지를 설치합니다.
npm install
```

### 3. 백엔드 서버 설정 (Backend Setup)

백엔드 서버는 Python으로 작성되었으며, 독립된 가상 환경에서 실행하는 것을 권장합니다.

```bash
# 1. (선택사항) Python 가상 환경을 생성합니다.
# 이 명령어는 'venv'라는 이름의 가상 환경 폴더를 생성합니다.
python -m venv venv

# 2. 생성한 가상 환경을 활성화합니다.
# Windows (PowerShell):
./venv/Scripts/Activate.ps1

# macOS / Linux (bash):
source venv/bin/activate

# 3. 백엔드 의존성 패키지를 설치합니다.
# (가상 환경이 활성화된 상태에서 실행해야 합니다.)
pip install -r backend_genre/requirements.txt
```

### 4. 추가 설정: FFmpeg 및 환경 변수 (매우 중요)

백엔드 서버의 모든 기능을 정상적으로 사용하려면 FFmpeg 설치와 `.env` 파일 설정이 반드시 필요합니다.

#### FFmpeg 설치

FFmpeg는 오디오 파일을 처리하는 데 사용되는 필수 도구입니다.

**- Windows의 경우:**

1.  **FFmpeg 다운로드**: [FFmpeg 공식 홈페이지](https://ffmpeg.org/download.html)에서 "Windows builds from gyan.dev"를 통해 `full_build` 버전을 다운로드합니다.
2.  **압축 해제**: 다운로드한 파일의 압축을 `C:\` 와 같이 경로가 단순한 곳에 해제합니다. (예: `C:\ffmpeg`)
3.  **환경 변수 설정**: '시스템 환경 변수 편집'을 실행하여 `Path` 시스템 변수에 `ffmpeg.exe` 파일이 위치한 `bin` 폴더 경로(예: `C:\ffmpeg\bin`)를 추가합니다.
    - **중요:** 환경 변수를 수정한 후에는 모든 터미널과 VSCode를 완전히 재시작해야 적용됩니다.

**- macOS의 경우:**

1.  **Homebrew 설치**: 터미널에 `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`를 붙여넣어 [Homebrew](https://brew.sh/index_ko)를 설치합니다.
2.  **FFmpeg 설치**: 터미널에 다음 명령어를 입력하여 간단하게 설치합니다.
    ```bash
    brew install ffmpeg
    ```
    - Homebrew로 설치하면 환경 변수(PATH)가 자동으로 설정되어 편리합니다.

#### 환경 변수 (`.env`) 파일 설정

프로젝트 루트 디렉터리(이 `README.md` 파일이 있는 위치)에 `.env` 라는 이름의 파일을 생성하고 아래 내용을 채워주세요.

```.env
# Google Cloud Platform 프로젝트 ID
GCP_PROJECT_ID="your-gcp-project-id"

# Google Cloud 인증 JSON 키 파일의 경로
GOOGLE_APPLICATION_CREDENTIALS="path/to/your/gcp-credentials.json"

# (선택사항) FFmpeg를 환경 변수(Path)에 등록하지 않았거나 다른 경로에 설치한 경우,
# ffmpeg 실행 파일의 전체 경로를 직접 지정할 수 있습니다.
# 예시 (macOS, homebrew): FFMPEG_PATH=/opt/homebrew/bin/ffmpeg
# 예시 (Windows): FFMPEG_PATH=C:/ffmpeg/bin/ffmpeg.exe
FFMPEG_PATH=
```

- `your-gcp-project-id`: 실제 사용하시는 GCP 프로젝트의 ID를 입력합니다.
- `path/to/your/gcp-credentials.json`: 다운로드한 GCP 서비스 계정 키(JSON 파일)의 상대 경로 또는 절대 경로를 입력합니다.

### 5. 개발 서버 실행

이제 프론트엔드와 백엔드 서버를 각각 실행할 준비가 되었습니다. **두 개의 터미널 창**을 열어주세요.

**첫 번째 터미널 (프론트엔드):**

```bash
# 개발 서버를 시작합니다.
npm run dev
```

**두 번째 터미널 (백엔드):**

```bash
# 1. 백엔드 폴더로 이동합니다.
cd backend_genre

# 2. (가상 환경을 사용한다면) 가상 환경이 활성화된 상태인지 확인합니다.
# 프롬프트 앞에 (venv)가 보여야 합니다.

# 3. 백엔드 서버를 시작합니다.
python server.py
```

이제 브라우저에서 `http://localhost:5173` (또는 터미널에 표시된 주소)으로 접속하여 애플리케이션을 확인할 수 있습니다.

---

## 📂 프로젝트 구조 (Project Structure)

```
music-project/
├── .vscode/              # VSCode 에디터 설정 (저장 시 자동 포맷 등)
├── public/               # 정적 파일 (index.html에서 직접 참조)
├── src/                  # 소스 코드 루트
│   ├── assets/           # 🖼️ 이미지, 아이콘 등 정적 리소스
│   │   └── react.svg
│   ├── components/       # 🧩 재사용 가능한 공통 UI 컴포넌트
│   │   ├── BlobBackground.tsx
│   │   ├── Button.tsx
│   │   ├── ExploreHeader.tsx
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx
│   │   ├── MusicCard.tsx
│   │   ├── Sidebar.tsx
│   │   └── SidebarItem.tsx
│   ├── constants/        # 📐 메뉴, 색상 등 애플리케이션 전반에서 사용되는 상수
│   ├── pages/            # 📄 각 페이지를 구성하는 메인 컴포넌트 (라우팅 단위)
│   │   ├── Explore/
│   │   │   ├── Explore.tsx
│   │   │   └── Explore.module.css
│   │   ├── Home/
│   │   │   ├── Home.tsx
│   │   │   └── Home.module.css
│   │   └── Make/
│   │       ├── Make.tsx
│   │       └── Make.module.css
│   ├── styles/           # 🎨 전역 CSS 파일 및 Tailwind 설정
│   │   └── globals.css
│   ├── types/            # ✍️ 프로젝트 전반에서 사용되는 TypeScript 타입 정의
│   │   └── index.d.ts
│   ├── App.tsx           # 🌐 최상위 애플리케이션 컴포넌트 및 라우팅 설정
│   └── main.tsx          # 🚀 애플리케이션 진입점 (DOM 렌더링)
├── .gitignore            # Git 추적 제외 파일 목록
├── .prettierrc           # Prettier 포맷터 설정
├── eslint.config.js      # ESLint 린터 설정
├── index.html            # 애플리케이션의 기본 HTML 템플릿
├── package.json          # 프로젝트 정보 및 의존성 패키지 목록
├── postcss.config.cjs    # PostCSS 설정 (Tailwind, Autoprefixer 플러그인)
├── tailwind.config.cjs   # Tailwind CSS 커스텀 설정
├── tsconfig.json         # TypeScript 컴파일러 설정
└── vite.config.js        # Vite 빌드 도구 설정
```

### 주요 파일 및 디렉터리 역할

- **`/` (루트)**

  - `tailwind.config.cjs`: Tailwind CSS의 핵심 설정 파일. 커스텀 디자인 시스템(색상, 폰트, 애니메이션)을 정의합니다.
  - `postcss.config.cjs`: PostCSS 설정 파일. `tailwindcss`와 `autoprefixer` 플러그인을 등록하여 CSS를 처리합니다.
  - `vite.config.js`: Vite 빌드 도구의 설정 파일입니다.
  - `.vscode/settings.json`: 에디터에서 저장 시 Prettier 포매팅과 ESLint 수정을 자동으로 실행하도록 설정합니다.

- **`/src`**
  - `main.tsx`: React 애플리케이션의 진입점. `ReactDOM`이 `App` 컴포넌트를 렌더링하고 `index.css`를 주입합니다.
  - `App.tsx`: 애플리케이션의 최상위 컴포넌트. `react-router-dom`을 사용하여 페이지 라우팅을 관리합니다.
  - `/components`: `Button`, `Sidebar`, `MusicCard` 등과 같이 재사용 가능한 작은 UI 조각들이 위치합니다. 각 컴포넌트는 `.tsx` 파일과 선택적으로 `.module.css` 파일을 가집니다.
  - `/pages`: `Home`, `Explore`, `Make` 페이지와 같이 여러 컴포넌트를 조합하여 하나의 완전한 페이지를 구성하는 컴포넌트들이 위치합니다.
  - `/styles`: `globals.css` 등 전역적으로 사용될 CSS 파일이 위치합니다.
  - `/constants`: 메뉴 구조, 색상 팔레트 등 애플리케이션 전체에서 공유되는 고정 값들을 정의합니다.
  - `/types`: `index.d.ts` 파일이 있으며, 컴포넌트 `props` 등 프로젝트에서 공통으로 사용되는 TypeScript 타입들을 선언합니다.

---

## 🤝 기여 가이드라인 (Contribution Guidelines)

이 프로젝트에 기여하고 싶으신 분은 아래의 가이드라인을 따라주세요. 여러분의 모든 기여를 환영합니다!

### 브랜치 전략

- `main`: 프로덕션에 배포되는 안정적인 브랜치입니다.
- `develop`: 다음 릴리스를 위한 개발이 진행되는 브랜치입니다.
- `feature/이름`: 새로운 기능을 개발할 때 `develop` 브랜치에서 분기하여 생성합니다. (예: `feature/login-page`)
- `fix/이름`: 버그를 수정할 때 `develop` 브랜치에서 분기하여 생성합니다. (예: `fix/sidebar-rendering-bug`)

### 커밋 메시지 규칙

커밋 메시지는 다른 사람들이 변경 사항을 쉽게 이해할 수 있도록 명확하게 작성해야 합니다. 아래의 접두사를 사용하는 것을 권장합니다.

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 스타일 변경 (포맷팅, 세미콜론 등)
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드 추가 또는 수정
- `chore`: 빌드 설정, 패키지 매니저 설정 등

**예시:** `feat: 로그인 기능 및 UI 구현`

### Pull Request (PR) 프로세스

1.  자신의 GitHub 계정으로 이 저장소를 **Fork**합니다.
2.  로컬 컴퓨터에 Fork한 저장소를 클론합니다.
3.  `develop` 브랜치를 기준으로 새로운 기능 또는 수정 브랜치를 생성합니다.
4.  작업을 완료한 후, 변경 사항을 커밋하고 자신의 Fork된 저장소로 푸시합니다.
5.  원본 저장소의 `develop` 브랜치로 **Pull Request**를 생성합니다.
6.  PR 템플릿에 따라 변경된 내용과 이유를 상세히 작성합니다.
7.  코드 리뷰를 거친 후, 승인되면 `develop` 브랜치에 머지됩니다.

궁금한 점이 있다면 언제든지 이슈(Issue)를 등록하여 질문해주세요.
