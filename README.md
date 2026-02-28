# 배달이요 (Baedariyo)

배달 서비스 플랫폼 프론트엔드

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Language | JavaScript (ES Module) |
| Routing | React Router DOM 7 |
| State (Client) | Zustand |
| State (Server) | TanStack Query |
| HTTP Client | Axios |
| Map | Kakao Map SDK |
| Font | Pretendard |

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
# .env 파일 수정
```

### Development

```bash
npm run dev
```

http://localhost:5173 에서 확인

### Backend Local Run Guide

백엔드(`baedariyo_be`, `payment`) 실행 방법은 아래 문서를 참고하세요.

- [docs/backend-run-guide.md](docs/backend-run-guide.md)

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
├── app/                        # 앱 설정
│   ├── App.jsx                 # 앱 진입점
│   ├── routes.jsx              # 라우트 정의
│   └── layouts/                # 레이아웃
│       ├── RootLayout.jsx      # 루트 레이아웃 (모바일 프레임)
│       ├── UserLayout.jsx      # 사용자 레이아웃
│       └── RiderLayout.jsx     # 라이더 레이아웃
├── pages/                      # 페이지 컴포넌트
│   ├── NotFoundPage.jsx
│   ├── user/
│   │   ├── HomePage.jsx
│   │   └── OrderPage.jsx
│   └── rider/
│       ├── DashboardPage.jsx
│       └── DeliveryPage.jsx
├── components/                 # 공통 컴포넌트
├── shared/
│   ├── api/                    # API 설정
│   │   ├── index.js
│   │   └── instance.js         # Axios 인스턴스
│   ├── store/                  # 상태 관리
│   │   ├── index.js
│   │   └── useExampleStore.js  # Zustand 스토어 예시
│   ├── lib/                    # 유틸리티
│   │   ├── queryClient.js      # TanStack Query 설정
│   │   └── QueryProvider.jsx   # Query Provider
│   └── styles/                 # 디자인 시스템
│       ├── colors.css
│       ├── typography.css
│       ├── elevation.css
│       └── fonts.css
├── lib/                        # 헬퍼 함수
└── assets/                     # 정적 자산
```

## Routing

| Path | Page | Layout |
|------|------|--------|
| `/` | HomePage | UserLayout |
| `/order` | OrderPage | UserLayout |
| `/rider` | DashboardPage | RiderLayout |
| `/rider/delivery` | DeliveryPage | RiderLayout |
| `/*` | NotFoundPage | - |

### Path Alias

`@/` → `src/`

```jsx
import Header from '@/components/Header';
import { api } from '@/shared/api';
import { useExampleStore } from '@/shared/store';
```

## State Management

### Zustand (Client State)

```jsx
import { useExampleStore } from '@/shared/store';

function Component() {
  const { count, increment } = useExampleStore();
  return <button onClick={increment}>{count}</button>;
}
```

### TanStack Query (Server State)

```jsx
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/shared/api';

// 조회
const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: () => api.get('/users').then(res => res.data),
});

// 변경
const mutation = useMutation({
  mutationFn: (newUser) => api.post('/users', newUser),
});
```

## API

### Axios Instance

```jsx
import { api } from '@/shared/api';

// GET
const response = await api.get('/endpoint');

// POST
const response = await api.post('/endpoint', { data });

// 인터셉터 설정됨 (src/shared/api/instance.js)
// - Request: 토큰 추가 (주석 처리됨)
// - Response: 에러 핸들링
```

## Git Convention

### Branch Strategy (GitHub Flow)

| Branch | Description |
|--------|-------------|
| `main` | 프로덕션 브랜치 |
| `feature/*` | 기능 개발 |
| `fix/*` | 버그 수정 |

### Commit Convention

[Conventional Commits](https://www.conventionalcommits.org/) 사용

```
<type>: <subject>

# Types
feat:     새로운 기능
fix:      버그 수정
docs:     문서 변경
style:    코드 포맷팅
refactor: 코드 리팩토링
perf:     성능 개선
test:     테스트 추가/수정
chore:    빌드, 설정 변경
ci:       CI 설정 변경
```

### PR Process

1. Feature 브랜치 생성
2. 작업 후 커밋
3. `main` 브랜치로 PR 생성
4. CI 통과 확인
5. 코드 리뷰 후 머지

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_KAKAO_APP_KEY` | 카카오맵 API 키 | Yes |
| `VITE_API_BASE_URL` | API 서버 주소 | No (default: localhost:8080) |

## Design System

### Colors

```css
/* Semantic Colors */
var(--color-primary)
var(--color-secondary)
var(--color-success)
var(--color-warning)
var(--color-error)
```

### Typography

```css
/* Headings */
.typo-h1 ~ .typo-h6

/* Body */
.typo-body1 ~ .typo-body3

/* Caption */
.typo-caption1, .typo-caption2
```

### Elevation

```css
/* Shadow */
var(--style-semantic-shadow-normal)
var(--style-semantic-shadow-emphasize)
var(--style-semantic-shadow-strong)
```

## CI/CD

### GitHub Actions

| Workflow | Trigger | Description |
|----------|---------|-------------|
| CI | push, PR | Lint, Build 검사 |
| PR Labeler | PR open | 자동 라벨링 |

### Husky Hooks

| Hook | Action |
|------|--------|
| pre-commit | lint-staged (ESLint, Prettier) |
| commit-msg | commitlint |
