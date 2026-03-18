# AI-DLC Demo Showcase - Code Generation Plan

## Unit Context

### Project Information
- **Project Name**: AI-DLC Demo Showcase
- **Project Type**: Greenfield
- **Framework**: Next.js (풀스택)
- **Language**: TypeScript
- **Styling**: Tailwind CSS

### Code Location
- **Application Code**: Workspace root (`/`)
- **Documentation**: `aidlc-docs/construction/aidlc-demo-showcase/code/`

---

## Code Generation Steps

### Phase 1: Project Setup

- [x] **Step 1**: Next.js 프로젝트 초기화 및 기본 설정
  - package.json 생성
  - tsconfig.json 설정
  - tailwind.config.js 설정
  - next.config.js 설정

- [x] **Step 2**: 프로젝트 디렉토리 구조 생성
  ```
  /
  ├── src/
  │   ├── app/                    # Next.js App Router
  │   │   ├── page.tsx            # StartPage
  │   │   ├── demo/page.tsx       # DemoPage
  │   │   ├── result/page.tsx     # ResultPage
  │   │   ├── layout.tsx          # Root Layout
  │   │   └── globals.css         # Global Styles
  │   │
  │   ├── components/             # UI Components
  │   │   ├── kiro-ide/           # Kiro IDE 시뮬레이션
  │   │   ├── animation/          # 애니메이션 시스템
  │   │   └── ui/                 # 공통 UI
  │   │
  │   ├── contexts/               # React Context
  │   ├── services/               # 서비스 레이어
  │   ├── types/                  # TypeScript 타입
  │   └── lib/                    # 유틸리티
  │
  ├── public/                     # Static Assets
  └── api/                        # API Routes (Next.js)
  ```

### Phase 2: Core Types & Context

- [x] **Step 3**: TypeScript 타입 정의
  - `src/types/demo.ts` - 데모 관련 타입
  - `src/types/animation.ts` - 애니메이션 타입
  - `src/types/api.ts` - API 타입

- [x] **Step 4**: DemoSessionContext 구현
  - `src/contexts/DemoSessionContext.tsx`
  - 전역 상태 관리 (세션, Phase, Stage, 파일 등)

### Phase 3: UI Components - Kiro IDE

- [x] **Step 5**: KiroIDELayout 컴포넌트
  - `src/components/kiro-ide/KiroIDELayout.tsx`
  - 파일 탐색기, 에디터, 터미널 레이아웃

- [x] **Step 6**: FileExplorer 컴포넌트
  - `src/components/kiro-ide/FileExplorer.tsx`
  - 파일 트리 구조, 파일 생성 애니메이션

- [x] **Step 7**: CodeEditor 컴포넌트
  - `src/components/kiro-ide/CodeEditor.tsx`
  - 타이핑 효과, 구문 하이라이팅

- [x] **Step 8**: PhaseIndicator 컴포넌트
  - `src/components/kiro-ide/PhaseIndicator.tsx`
  - Phase/Stage 진행 상태 표시

### Phase 4: Animation System

- [x] **Step 9**: MousePointer 컴포넌트
  - `src/components/animation/MousePointer.tsx`
  - 가상 마우스 커서, 이동/클릭 애니메이션

- [x] **Step 10**: TypingEffect 컴포넌트
  - `src/components/animation/TypingEffect.tsx`
  - 타이핑 효과 애니메이션

- [x] **Step 11**: AnimationOrchestrator 컴포넌트
  - `src/components/animation/AnimationOrchestrator.tsx`
  - 전체 애니메이션 시퀀스 조율

### Phase 5: Result Components

- [x] **Step 12**: MVPPreview 컴포넌트
  - `src/components/ui/MVPPreview.tsx`
  - 동적 React 컴포넌트 렌더링

- [x] **Step 13**: AWSArchitectureDiagram 컴포넌트
  - `src/components/ui/AWSArchitectureDiagram.tsx`
  - AWS 서비스 다이어그램

- [x] **Step 14**: ResultSummary 컴포넌트
  - `src/components/ui/ResultSummary.tsx`
  - 결과 요약, QR 코드

### Phase 6: Pages

- [x] **Step 15**: StartPage (Home)
  - `src/app/page.tsx`
  - 프로젝트 아이디어 입력, 예시 프로젝트

- [x] **Step 16**: DemoPage
  - `src/app/demo/page.tsx`
  - Kiro IDE 시뮬레이션, 애니메이션 진행

- [x] **Step 17**: ResultPage
  - `src/app/result/page.tsx`
  - MVP 미리보기, 결과 요약

### Phase 7: API Routes

- [x] **Step 18**: Demo Start API
  - `src/app/api/demo/start/route.ts`
  - 세션 시작, 로깅

- [x] **Step 19**: Demo Stream API
  - `src/app/api/demo/stream/route.ts`
  - AI 스트리밍 응답 (SSE)

- [x] **Step 20**: Demo Estimate API
  - `src/app/api/demo/estimate/route.ts`
  - Production 예상 정보 계산

- [x] **Step 21**: Log API
  - `src/app/api/log/route.ts`
  - 사용자 입력 로깅

### Phase 8: Services

- [x] **Step 22**: AIService 구현
  - `src/services/AIService.ts`
  - LLM API 연동, 프롬프트 관리

- [x] **Step 23**: LogService 구현
  - `src/services/LogService.ts`
  - 로그 저장/조회

- [x] **Step 24**: EstimateService 구현
  - `src/services/EstimateService.ts`
  - 복잡도 분석, 예상 계산

### Phase 9: Styling & Assets

- [x] **Step 25**: Global Styles
  - `src/app/globals.css`
  - Tailwind 설정, Kiro IDE 다크 테마

- [x] **Step 26**: AWS 아이콘 및 Assets
  - SVG 인라인으로 AWSArchitectureDiagram.tsx에 포함

### Phase 10: Documentation

- [x] **Step 27**: README.md 작성
  - 프로젝트 설명, 실행 방법

- [x] **Step 28**: 코드 생성 요약 문서
  - `aidlc-docs/construction/aidlc-demo-showcase/code/code-summary.md`

---

## Estimated Scope
- **Total Steps**: 28
- **Files to Create**: ~30개
- **Complexity**: Moderate

## Dependencies
- Next.js 14+
- React 18+
- TypeScript 5+
- Tailwind CSS 3+
- Framer Motion (애니메이션)
- OpenAI/Anthropic SDK (AI 연동)
