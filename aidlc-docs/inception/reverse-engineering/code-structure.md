# Code Structure

## Build System
- **Type**: npm + Next.js 14
- **Configuration**: `package.json`, `next.config.js`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`
- **Build Command**: `npm run build` (Next.js production build)
- **Dev Command**: `npm run dev` (Next.js dev server)
- **Test Command**: `npx jest` (Jest + @testing-library)

## Project Structure

```
src/
  app/                          # Next.js App Router
    page.tsx                    # 시작 페이지 (/)
    layout.tsx                  # Root Layout (DemoSessionProvider 래핑)
    globals.css                 # 전역 스타일 (Kiro 디자인 시스템)
    demo/
      page.tsx                  # 데모 진행 페이지 (/demo)
    result/
      page.tsx                  # 결과 페이지 (/result)
    api/
      demo/
        start/route.ts          # POST - 세션 시작
        stream/route.ts         # GET - SSE 스트리밍
        estimate/route.ts       # POST - 프로젝트 예상 계산
        send-report/route.ts    # POST - 이메일 리포트
      log/route.ts              # POST/GET - 로그 기록/조회
  components/
    kiro-ide/                   # Kiro IDE 시뮬레이션 컴포넌트
      KiroIDELayout.tsx         # IDE 전체 레이아웃
      FileExplorer.tsx          # 파일 트리 탐색기
      CodeEditor.tsx            # 코드 에디터 (타이핑 효과)
      PhaseIndicator.tsx        # AI-DLC 진행 상태 바
    animation/                  # 애니메이션 시스템 (미사용)
      AnimationOrchestrator.tsx
      MousePointer.tsx
      TypingEffect.tsx
    ui/                         # 결과 페이지 UI 컴포넌트
      MVPPreview.tsx            # MVP 미리보기 (산업별 분기)
      AWSArchitectureDiagram.tsx # AWS 아키텍처 Mermaid 다이어그램
      BusinessWorkflowDiagram.tsx # 비즈니스 워크플로우 SVG
      ResultSummary.tsx         # 결과 요약 + QR 코드
  contexts/
    DemoSessionContext.tsx       # 전역 상태 관리 (useReducer)
  services/
    AIService.ts                # AI 스트리밍 서비스 클라이언트
    EstimateService.ts          # 프로젝트 예상 계산 (클라이언트 사이드)
    LogService.ts               # 로그 서비스 클라이언트
  types/
    demo.ts                     # 핵심 도메인 타입 (Phase, Stage, DemoResult 등)
    api.ts                      # API 요청/응답 타입
    animation.ts                # 애니메이션 관련 타입
  __tests__/                    # 테스트 파일 (8개 스위트)
    AWSArchitecture.test.ts
    BusinessWorkflow.test.ts
    DemoPage.test.tsx
    DemoSessionContext.test.tsx
    EstimateService.test.ts
    MVPPreview.test.tsx
    ResultPage.test.tsx
    StartPage.test.tsx
```

## Existing Files Inventory

### Pages (3개)
- `src/app/page.tsx` - 시작 페이지: 아이디어 입력, 6개 산업 카테고리 예시, 세션 초기화
- `src/app/demo/page.tsx` - 데모 진행: 핵심 파일, detectScenario, generateDemoSteps, runStep, 7단계 시뮬레이션
- `src/app/result/page.tsx` - 결과 페이지: 6개 탭 (MVP, AWS, 워크플로우, 예상, 산출물, Kiro 소개), 이메일 모달

### Layout & Styles (2개)
- `src/app/layout.tsx` - Root Layout: Inter 폰트, DemoSessionProvider 래핑
- `src/app/globals.css` - Kiro 디자인 시스템 CSS (다크 테마, 그라데이션, 애니메이션)

### Kiro IDE Components (4개)
- `src/components/kiro-ide/KiroIDELayout.tsx` - IDE 레이아웃: 타이틀바, 파일탐색기, 에디터, 채팅 패널, isAnimating prop
- `src/components/kiro-ide/FileExplorer.tsx` - 파일 트리: 재귀적 렌더링, 확장/축소, 파일 아이콘 색상
- `src/components/kiro-ide/CodeEditor.tsx` - 코드 에디터: 타이핑 효과, 라인 넘버, 구문 하이라이팅
- `src/components/kiro-ide/PhaseIndicator.tsx` - 진행 바: 3개 Phase, 5개 Stage, 산출물 체크박스

### Animation Components (3개 - 현재 미사용)
- `src/components/animation/AnimationOrchestrator.tsx` - 애니메이션 시퀀스 관리
- `src/components/animation/MousePointer.tsx` - 마우스 포인터 애니메이션
- `src/components/animation/TypingEffect.tsx` - 타이핑 효과 애니메이션

### UI Components (4개)
- `src/components/ui/MVPPreview.tsx` - MVP 미리보기: 5개 산업별 분기 (이커머스, 예약, 학습, 채팅, 대시보드), 사용자/관리자 페르소나, 모바일/데스크톱 토글
- `src/components/ui/AWSArchitectureDiagram.tsx` - AWS 아키텍처: 6개 산업별 Mermaid 다이어그램, 동적 import
- `src/components/ui/BusinessWorkflowDiagram.tsx` - 비즈니스 워크플로우: 4개 산업별 시퀀스 다이어그램 (SVG)
- `src/components/ui/ResultSummary.tsx` - 결과 요약: 시간 비교, 팀 구성, QR 코드

### Context (1개)
- `src/contexts/DemoSessionContext.tsx` - 전역 상태: useReducer, 10개 액션 타입, 파일 트리 관리 헬퍼

### Services (3개)
- `src/services/AIService.ts` - AI 스트리밍: SSE 파싱, AsyncGenerator, buildPrompt
- `src/services/EstimateService.ts` - 예상 계산: 키워드 기반 복잡도 분석, 팀/비용/기간 산출
- `src/services/LogService.ts` - 로그: 세션 시작/완료 기록, 통계 조회

### API Routes (5개)
- `src/app/api/demo/start/route.ts` - POST: 세션 ID 생성 (uuid)
- `src/app/api/demo/stream/route.ts` - GET: SSE 스트리밍 (템플릿 기반)
- `src/app/api/demo/estimate/route.ts` - POST: 복잡도 분석 + 예상 계산 + AWS 아키텍처 + MVP 코드
- `src/app/api/demo/send-report/route.ts` - POST: 이메일 리포트 (로그만 기록)
- `src/app/api/log/route.ts` - POST/GET: In-memory 로그 저장/통계

### Types (3개)
- `src/types/demo.ts` - Phase, Stage, FileTreeNode, DemoResult, DemoSessionState 등
- `src/types/api.ts` - StartDemoRequest/Response, AIChunk, EstimateRequest/Response 등
- `src/types/animation.ts` - AnimationStep, AnimationSequence, MousePointerState 등

### Tests (8개)
- `src/__tests__/StartPage.test.tsx` - 시작 페이지 테스트
- `src/__tests__/DemoPage.test.tsx` - 데모 페이지 테스트
- `src/__tests__/ResultPage.test.tsx` - 결과 페이지 테스트
- `src/__tests__/DemoSessionContext.test.tsx` - Context 테스트
- `src/__tests__/EstimateService.test.ts` - EstimateService 테스트
- `src/__tests__/MVPPreview.test.tsx` - MVP 미리보기 테스트
- `src/__tests__/AWSArchitecture.test.ts` - AWS 아키텍처 테스트
- `src/__tests__/BusinessWorkflow.test.ts` - 비즈니스 워크플로우 테스트

## Design Patterns

### DemoPage 핵심 함수 상세

#### `detectScenario(idea: string): IndustryScenario`
- **위치**: `src/app/demo/page.tsx` Line 36
- **역할**: 사용자 입력 키워드를 분석하여 8개 산업 시나리오 중 하나를 반환
- **분기 로직**: `idea.toLowerCase().includes()` 키워드 매칭
- **시나리오 목록**: 이커머스, 핀테크, 헬스케어, 교육, 물류, SaaS, 채팅, 기본(범용)
- **반환 데이터**: domain, userTypes, mainFeatures(5개), techStack, nfrFocus, questions(3개), userStories(2개 페르소나), apiEndpoints(5개), awsServices(7개)
- **핵심**: 이 함수의 반환값이 이후 모든 단계의 콘텐츠를 결정함

#### `generateDemoSteps(projectIdea: string): DemoStep[]`
- **위치**: `src/app/demo/page.tsx` Line 214
- **역할**: detectScenario 결과를 기반으로 7개 데모 단계를 생성
- **7단계 구성**:
  1. 요구사항 분석 (INCEPTION/requirements) - requirements.md
  2. 사용자 스토리 (INCEPTION/design) - user-stories.md
  3. 애플리케이션 설계 (INCEPTION/design) - application-design.md
  4. NFR 설계 (CONSTRUCTION/code) - nfr-design.md
  5. 코드 생성 (CONSTRUCTION/code) - page.tsx
  6. 인프라 설계 (OPERATIONS/infrastructure) - infrastructure.yaml
  7. 배포 계획 (OPERATIONS/deployment) - deployment-plan.md
- **각 단계 포함 데이터**: phase, stage, label, fileName, fileContent(산업별 상세 내용), chatSequence(AI/User/System 메시지 배열)

#### `runStep(stepIdx: number): Promise<void>`
- **위치**: `src/app/demo/page.tsx` DemoPageContent 내부
- **역할**: 특정 단계의 채팅 시뮬레이션 + 파일 생성을 비동기로 실행
- **취소 메커니즘**: `runIdRef`를 증가시켜 이전 실행을 무효화 (`cancelled()` 체크)
- **타이밍**: AI 메시지 800ms, User 메시지 400ms, System 메시지 200ms 딜레이
- **완료 시**: 파일 추가, 에디터 콘텐츠 설정, 진행률 업데이트, 완료 안내 메시지 추가

### globals.css 커스텀 클래스

| 클래스 | 용도 |
|--------|------|
| `.kiro-glow` | 보라색 box-shadow 글로우 효과 (카드, 입력 폼) |
| `.kiro-glow-accent` | 주황색(AWS) box-shadow 글로우 효과 |
| `.kiro-gradient-text` | 보라색->파란색 그라데이션 텍스트 (AI-DLC 로고 등) |
| `.kiro-gradient-border` | 그라데이션 테두리 (::before pseudo-element) |
| `.animate-fade-in-up` | 아래에서 위로 페이드인 (0.6s) |
| `.animate-pulse-glow` | 보라색 글로우 펄스 (3s infinite, 로고) |
| `.shimmer` | 좌->우 쉬머 효과 (로딩 상태) |

### CSS 변수 (Design Tokens)

| 변수 | 값 | 용도 |
|------|-----|------|
| `--kiro-bg` | `#0a0a0f` | 메인 배경 |
| `--kiro-surface` | `#12121a` | 카드/사이드바 배경 |
| `--kiro-surface-2` | `#1a1a25` | 호버/활성 배경 |
| `--kiro-border` | `#2a2a3a` | 테두리 |
| `--kiro-text` | `#e4e4ed` | 주요 텍스트 |
| `--kiro-text-muted` | `#8888a0` | 보조 텍스트 |
| `--kiro-accent` | `#ff9900` | AWS 오렌지 액센트 |
| `--kiro-purple` | `#7c5cfc` | 보라색 액센트 |
| `--kiro-purple-light` | `#9d85fc` | 밝은 보라색 |
| `--kiro-blue` | `#4a9eff` | 파란색 액센트 |
| `--kiro-gradient-start` | `#7c5cfc` | 그라데이션 시작 |
| `--kiro-gradient-end` | `#4a9eff` | 그라데이션 끝 |

## Design Patterns

### State Management Pattern (useReducer + Context)
- **Location**: `src/contexts/DemoSessionContext.tsx`
- **Purpose**: 전역 데모 세션 상태를 단일 소스로 관리
- **Implementation**: useReducer로 10개 액션 타입 처리, Context Provider로 전체 앱에 제공

### Scenario Detection Pattern (Strategy-like)
- **Location**: `src/app/demo/page.tsx` - `detectScenario()`
- **Purpose**: 사용자 입력 키워드를 분석하여 산업별 시나리오 분기
- **Implementation**: 키워드 매칭으로 7개 산업 시나리오 중 하나를 선택, 각 시나리오마다 다른 질문/요구사항/기술스택/API/AWS 서비스 생성

### Component Composition Pattern
- **Location**: `src/components/kiro-ide/KiroIDELayout.tsx`
- **Purpose**: IDE 레이아웃을 독립적인 하위 컴포넌트로 구성
- **Implementation**: FileExplorer, CodeEditor, PhaseIndicator, ChatPanel을 조합

### Dynamic Import Pattern
- **Location**: `src/components/ui/AWSArchitectureDiagram.tsx`
- **Purpose**: Mermaid.js를 클라이언트 사이드에서만 로드
- **Implementation**: `await import('mermaid')` 동적 import

## Critical Dependencies

### next (14.2.0)
- **Usage**: App Router, API Routes, 이미지 최적화
- **Purpose**: 풀스택 React 프레임워크

### framer-motion (^11.0.0)
- **Usage**: 페이지 전환, 컴포넌트 애니메이션, AnimatePresence
- **Purpose**: 선언적 애니메이션 라이브러리

### mermaid (^11.12.3)
- **Usage**: AWSArchitectureDiagram에서 동적 다이어그램 렌더링
- **Purpose**: 텍스트 기반 다이어그램 생성

### qrcode.react (^3.1.0)
- **Usage**: ResultSummary에서 QR 코드 생성
- **Purpose**: React QR 코드 컴포넌트
