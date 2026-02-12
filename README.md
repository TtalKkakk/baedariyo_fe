# 배달이요 (Baedariyo)

배달 서비스 플랫폼 프론트엔드

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Language**: JavaScript (ES Module)
- **Map**: Kakao Map SDK
- **Font**: Pretendard

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env
# .env 파일에 VITE_KAKAO_APP_KEY 입력
```

### Development

```bash
npm run dev
```

http://localhost:5173 에서 확인

### Build

```bash
npm run build
npm run preview
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | ESLint 검사 |
| `npm run lint:fix` | ESLint 자동 수정 |
| `npm run format` | Prettier 포맷팅 |
| `npm run format:check` | 포맷팅 검사 |

## Project Structure

```
src/
├── app/                    # 앱 설정, 라우팅
│   ├── App.jsx
│   ├── routes.jsx
│   └── layouts/            # 레이아웃 컴포넌트
│       ├── RootLayout.jsx
│       ├── UserLayout.jsx
│       └── RiderLayout.jsx
├── components/             # 공통 컴포넌트
├── lib/                    # 유틸리티, 헬퍼
├── shared/
│   └── styles/             # 디자인 시스템
│       ├── colors.css      # 컬러 토큰
│       ├── typography.css  # 타이포그래피
│       ├── elevation.css   # 그림자, 블러
│       └── fonts.css       # 폰트
└── assets/                 # 정적 자산
```

### Path Alias

`@/` → `src/`

```jsx
import Header from '@/components/Header';
```

## Git Convention

### Branch Strategy

GitHub Flow 사용

- `main`: 프로덕션 브랜치
- `feature/*`: 기능 개발
- `fix/*`: 버그 수정

### Commit Convention

[Conventional Commits](https://www.conventionalcommits.org/) 사용

```
<type>: <subject>

# 예시
feat: 로그인 기능 추가
fix: 버튼 클릭 버그 수정
docs: README 업데이트
style: 버튼 스타일 변경
refactor: 인증 로직 리팩토링
perf: 이미지 로딩 최적화
test: 로그인 테스트 추가
chore: 의존성 업데이트
ci: GitHub Actions 설정
```

### PR Convention

1. `main` 브랜치로 PR 생성
2. PR 템플릿 작성
3. CI 통과 확인
4. 코드 리뷰 후 머지

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_KAKAO_APP_KEY` | 카카오맵 API 키 |

## Design System

### Colors

`src/shared/styles/colors.css`에 정의된 컬러 토큰 사용

```css
/* Semantic Colors */
var(--color-primary)
var(--color-secondary)
var(--color-success)
var(--color-warning)
var(--color-error)
```

### Typography

`src/shared/styles/typography.css`에 정의된 타이포그래피 사용

```css
/* Headings */
.typo-h1 ~ .typo-h6

/* Body */
.typo-body1 ~ .typo-body3

/* Caption */
.typo-caption1, .typo-caption2
```
