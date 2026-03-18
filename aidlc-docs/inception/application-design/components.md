# AI-DLC Demo Showcase - Components

## 컴포넌트 개요

```
┌─────────────────────────────────────────────────────────────────┐
│                        Web Application                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Pages     │  │    UI       │  │  Animation  │             │
│  │  Components │  │ Components  │  │   System    │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│         │                │                │                     │
│         └────────────────┼────────────────┘                     │
│                          │                                      │
│  ┌───────────────────────┴───────────────────────┐             │
│  │              State Management                  │             │
│  │         (Demo Session Context)                 │             │
│  └───────────────────────┬───────────────────────┘             │
│                          │                                      │
├──────────────────────────┼──────────────────────────────────────┤
│                          │           API Layer                  │
│  ┌───────────────────────┴───────────────────────┐             │
│  │              API Routes (Next.js)              │             │
│  │    /api/demo/start  /api/demo/stream  /api/log │             │
│  └───────────────────────┬───────────────────────┘             │
│                          │                                      │
│  ┌───────────────────────┴───────────────────────┐             │
│  │              Services Layer                    │             │
│  │   AIService  │  LogService  │  EstimateService │             │
│  └───────────────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Pages (페이지 컴포넌트)

### 1.1 StartPage
**목적**: 데모 시작 화면

**책임**:
- AI-DLC 브랜딩 표시
- 프로젝트 아이디어 입력 폼
- 예시 프로젝트 제안 버튼
- 데모 시작 트리거

**인터페이스**:
```typescript
interface StartPageProps {
  onStart: (projectIdea: string) => void;
  exampleProjects: string[];
}
```

### 1.2 DemoPage
**목적**: AI-DLC 전체 과정 자동 진행 화면

**책임**:
- Kiro IDE 레이아웃 렌더링
- 애니메이션 시스템 조율
- AI 스트리밍 응답 표시
- Phase/Stage 진행 상태 관리

**인터페이스**:
```typescript
interface DemoPageProps {
  projectIdea: string;
  onComplete: (result: DemoResult) => void;
}
```

### 1.3 ResultPage
**목적**: MVP 미리보기 + 결과 요약 화면

**책임**:
- MVP UI 컴포넌트 렌더링
- AWS 아키텍처 다이어그램 표시
- Production 예상 정보 표시
- QR 코드 표시
- 처음으로 돌아가기 기능

**인터페이스**:
```typescript
interface ResultPageProps {
  demoResult: DemoResult;
  onReset: () => void;
}
```

---

## 2. UI Components (UI 컴포넌트)

### 2.1 KiroIDELayout
**목적**: Kiro IDE 화면 시뮬레이션

**책임**:
- 좌측 파일 탐색기 패널
- 중앙 에디터 영역
- 하단 터미널 패널
- 상단 탭 바
- 다크 테마 스타일링

**인터페이스**:
```typescript
interface KiroIDELayoutProps {
  files: FileTreeNode[];
  activeFile: string | null;
  editorContent: string;
  terminalOutput: string;
  tabs: string[];
}
```

### 2.2 FileExplorer
**목적**: 파일 탐색기 시뮬레이션

**책임**:
- 폴더/파일 트리 구조 표시
- 파일 생성 애니메이션
- 파일 선택 하이라이트
- 폴더 확장/축소

**인터페이스**:
```typescript
interface FileExplorerProps {
  files: FileTreeNode[];
  selectedFile: string | null;
  onFileClick: (path: string) => void;
}
```

### 2.3 CodeEditor
**목적**: 코드/문서 에디터 시뮬레이션

**책임**:
- 타이핑 효과로 콘텐츠 표시
- 구문 하이라이팅
- 라인 넘버 표시
- 스크롤 관리

**인터페이스**:
```typescript
interface CodeEditorProps {
  content: string;
  language: string;
  isTyping: boolean;
  typingSpeed: number;
}
```

### 2.4 PhaseIndicator
**목적**: 현재 Phase/Stage 진행 상태 표시

**책임**:
- INCEPTION/CONSTRUCTION/OPERATIONS 단계 표시
- 현재 진행 중인 Stage 하이라이트
- 진행률 프로그레스 바

**인터페이스**:
```typescript
interface PhaseIndicatorProps {
  currentPhase: 'INCEPTION' | 'CONSTRUCTION' | 'OPERATIONS';
  currentStage: string;
  progress: number; // 0-100
}
```

### 2.5 MVPPreview
**목적**: 생성된 MVP UI 미리보기

**책임**:
- 동적 React 컴포넌트 렌더링
- 디바이스 프레임 표시
- 인터랙티브 요소 동작

**인터페이스**:
```typescript
interface MVPPreviewProps {
  componentCode: string;
  deviceType: 'mobile' | 'desktop';
}
```

### 2.6 AWSArchitectureDiagram
**목적**: AWS 아키텍처 다이어그램 표시

**책임**:
- AWS 서비스 아이콘 표시
- 서비스 간 연결 관계 시각화
- 애니메이션 효과

**인터페이스**:
```typescript
interface AWSArchitectureDiagramProps {
  services: AWSService[];
  connections: ServiceConnection[];
}
```

---

## 3. Animation System (애니메이션 시스템)

### 3.1 MousePointer
**목적**: 가상 마우스 커서 애니메이션

**책임**:
- 마우스 커서 렌더링
- 부드러운 이동 애니메이션 (ease-in-out)
- 클릭 시 시각적 피드백
- 위치 시퀀스 관리

**인터페이스**:
```typescript
interface MousePointerProps {
  position: { x: number; y: number };
  isClicking: boolean;
  isVisible: boolean;
}
```

### 3.2 AnimationOrchestrator
**목적**: 전체 애니메이션 시퀀스 조율

**책임**:
- 애니메이션 스텝 순차 실행
- 타이밍 제어
- 마우스 이동 + 클릭 + 타이핑 조합
- 일시정지/재개 관리

**인터페이스**:
```typescript
interface AnimationOrchestratorProps {
  steps: AnimationStep[];
  onStepComplete: (stepIndex: number) => void;
  onAllComplete: () => void;
  speed: number; // 1 = normal, 0.5 = slow
}
```

### 3.3 TypingEffect
**목적**: 타이핑 효과 애니메이션

**책임**:
- 문자 단위 점진적 표시
- 타이핑 속도 제어
- 커서 깜빡임 효과

**인터페이스**:
```typescript
interface TypingEffectProps {
  text: string;
  speed: number; // ms per character
  onComplete: () => void;
}
```

---

## 4. State Management (상태 관리)

### 4.1 DemoSessionContext
**목적**: 데모 세션 전역 상태 관리

**책임**:
- 현재 Phase/Stage 상태
- 생성된 파일 목록
- AI 응답 데이터
- 애니메이션 진행 상태
- 세션 ID 관리

**상태 구조**:
```typescript
interface DemoSessionState {
  sessionId: string;
  projectIdea: string;
  currentPhase: Phase;
  currentStage: Stage;
  files: FileTreeNode[];
  aiResponses: AIResponse[];
  animationProgress: number;
  isComplete: boolean;
  startTime: Date;
  result: DemoResult | null;
}
```

---

## 5. API Routes (API 라우트)

### 5.1 /api/demo/start
**목적**: 데모 세션 시작

**책임**:
- 세션 ID 생성
- 초기 상태 설정
- 로깅 시작

### 5.2 /api/demo/stream
**목적**: AI 스트리밍 응답

**책임**:
- LLM API 호출
- Server-Sent Events 스트리밍
- Phase별 프롬프트 관리

### 5.3 /api/demo/estimate
**목적**: Production 예상 정보 생성

**책임**:
- 프로젝트 복잡도 분석
- 인력/기간 추정
- AI 기반 동적 계산

### 5.4 /api/log
**목적**: 사용자 입력 로깅

**책임**:
- 로그 데이터 저장
- 타임스탬프 기록
- 세션 정보 연결

---

## 6. Services (서비스 레이어)

### 6.1 AIService
**목적**: LLM API 연동

**책임**:
- AI 프롬프트 구성
- 스트리밍 응답 처리
- Phase별 콘텐츠 생성

### 6.2 LogService
**목적**: 로깅 관리

**책임**:
- 로그 데이터 저장
- 로그 조회
- 통계 집계

### 6.3 EstimateService
**목적**: Production 예상 정보 계산

**책임**:
- 프로젝트 복잡도 분석
- 인력 구성 추정
- 기간 계산
