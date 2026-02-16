# CLAUDE.md

이 파일은 Claude가 이 프로젝트에서 작업할 때 참고해야 하는 규칙과 컨텍스트를 담고 있습니다.

## 프로젝트 개요

배달이요(Baedariyo) - 배달 서비스 프론트엔드 애플리케이션

## 기술 스택

- React 19
- Vite
- React Router v7
- TanStack Query (React Query)
- Zustand (상태 관리)
- Axios (HTTP 클라이언트)
- Tailwind CSS v4

## 프로젝트 구조 (FSD 아키텍처)

```
src/
├── app/                    # 앱 레이어 - 라우팅, 레이아웃, 프로바이더
│   ├── App.jsx
│   ├── layouts/
│   └── routes.jsx
├── pages/                  # 페이지 레이어 - 라우트별 페이지 컴포넌트
│   ├── user/
│   └── rider/
├── widgets/                # 위젯 레이어 - 조합된 UI 블록 (Header 등)
├── features/               # 피처 레이어 - 비즈니스 기능 단위
│   └── map/
├── shared/                 # 공유 레이어 - 재사용 모듈
│   ├── api/               # API 클라이언트
│   ├── lib/               # 유틸리티 함수
│   ├── store/             # Zustand 스토어
│   └── styles/            # 디자인 토큰 (colors, typography 등)
├── index.css
└── main.jsx
```

### 레이어 규칙

- **상위 레이어는 하위 레이어만 import 가능**
- `app` → `pages` → `widgets` → `features` → `shared`
- `shared`는 다른 레이어를 import 불가

## 스타일링 규칙

### Tailwind CSS 사용 필수

- **CSS Modules, styled-components, emotion 사용 금지**
- **인라인 style 속성 사용 금지**
- 모든 스타일링은 Tailwind 유틸리티 클래스로 작성

```jsx
// 좋은 예시
<button className="h-11 px-5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600">
  버튼
</button>

// 나쁜 예시
<button style={{ height: 44, padding: '0 20px' }}>버튼</button>
```

### 디자인 토큰 사용

디자인 시스템 색상/그림자는 CSS 변수를 arbitrary values로 사용:

```jsx
<div className="bg-[var(--color-atomic-blue-70)] text-[var(--color-semantic-label-normal)]">
  콘텐츠
</div>
```

## Import 별칭

- `@/` → `src/`

```jsx
import { Header } from '@/widgets';
import { KakaoMap } from '@/features/map';
```

## 코드 컨벤션

- ESLint + Prettier 사용
- Conventional Commits (`feat:`, `fix:`, `chore:` 등)
- 컴포넌트는 named export + index.js로 re-export

## 명령어

- `npm run dev` - 개발 서버
- `npm run build` - 프로덕션 빌드
- `npm run lint` - ESLint 검사
- `npm run lint:fix` - ESLint 자동 수정
- `npm run format` - Prettier 포맷팅
