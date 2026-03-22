# AI-DLC Demo Showcase - Component Methods (Brownfield Update)

## 1. 신규 모듈 Methods

### ScenarioDetector (`src/utils/scenarioDetector.ts`)
```typescript
// 산업 시나리오 감지 (DemoPage에서 분리)
detectScenario(idea: string): IndustryScenario

// 시나리오 데이터 (외부화)
interface IndustryScenario {
  domain: string
  userTypes: string[]
  mainFeatures: string[]
  techStack: string[]
  nfrFocus: string[]
  questions: string[]
  userStories: UserStoryData[]
  apiEndpoints: string[]
  awsServices: string[]
}
```

### DemoStepGenerator (`src/utils/demoStepGenerator.ts`)
```typescript
// 7개 데모 단계 생성 (DemoPage에서 분리)
generateDemoSteps(projectIdea: string): DemoStep[]

// 단계별 애니메이션 시퀀스 생성 (NEW)
generateAnimationSequence(step: DemoStep): AnimationStep[]

interface DemoStep {
  phase: Phase
  stage: Stage
  label: string
  fileName: string
  fileContent: string
  chatSequence: ChatMessage[]
  animationSequence: AnimationStep[]  // NEW
}
```

### useDemoProgress Hook (`src/hooks/useDemoProgress.ts`)
```typescript
interface UseDemoProgressReturn {
  currentStep: number
  isAnimating: boolean
  stepCompleted: boolean
  progress: number
  handleNextStep: () => void
  handlePrevStep: () => void
  setIsAnimating: (v: boolean) => void
  setStepCompleted: (v: boolean) => void
}

useDemoProgress(totalSteps: number): UseDemoProgressReturn
```

### useRunStep Hook (`src/hooks/useRunStep.ts`)
```typescript
interface UseRunStepReturn {
  runStep: (stepIdx: number) => Promise<void>
  cancelCurrentRun: () => void
}

useRunStep(
  demoSteps: DemoStep[],
  callbacks: {
    onChatMessage: (msg: ChatMessage) => void
    onFileAdd: (file: FileTreeNode) => void
    onEditorContent: (content: string) => void
    onPhaseChange: (phase: Phase, stage: Stage) => void
    onProgress: (progress: number) => void
    onStepComplete: () => void
    onAnimationStep: (step: AnimationStep) => void  // NEW
  }
): UseRunStepReturn
```

---

## 2. Animation System Methods (통합)

### MousePointer
```typescript
// 위치로 이동 (ease-in-out)
moveTo(x: number, y: number, duration?: number): Promise<void>

// 클릭 애니메이션 (ripple/scale)
click(): Promise<void>

// 표시/숨김
setVisible(visible: boolean): void

// 요소 위치로 이동 (DOM element ref 기반)
moveToElement(elementRef: RefObject<HTMLElement>): Promise<void>
```

### AnimationOrchestrator
```typescript
// 단계별 애니메이션 시퀀스 실행
executeSequence(steps: AnimationStep[]): Promise<void>

// 현재 시퀀스 취소
cancelSequence(): void

// 단일 스텝 실행
executeStep(step: AnimationStep): Promise<void>

interface AnimationStep {
  type: 'move' | 'click' | 'type' | 'scroll' | 'wait'
  target?: string          // CSS selector 또는 element ID
  position?: { x: number, y: number }
  text?: string            // type 액션용
  duration?: number        // ms
  delay?: number           // 스텝 전 대기
}
```

### TypingEffect
```typescript
// 타이핑 시작
startTyping(text: string, speed?: number): Promise<void>

// 타이핑 중지
stopTyping(): void

// 즉시 완료
completeImmediately(): void
```

---

## 3. i18n System Methods

### LanguageContext
```typescript
interface LanguageContextValue {
  locale: 'ko' | 'en'
  setLocale: (locale: 'ko' | 'en') => void
  t: (key: string) => string
}
```

### useTranslation Hook (`src/i18n/index.ts`)
```typescript
// 번역 함수 반환
useTranslation(): {
  t: (key: string) => string
  locale: 'ko' | 'en'
  setLocale: (locale: 'ko' | 'en') => void
}

// 사용 예시
const { t } = useTranslation()
t('start.title')        // "어떤 서비스를 만들고 싶으세요?" | "What service would you like to build?"
t('demo.nextStep')      // "다음 단계" | "Next Step"
t('result.tabs.mvp')    // "MVP 미리보기" | "MVP Preview"
```

### LanguageToggle
```typescript
interface LanguageToggleProps {
  className?: string
}
// 내부적으로 useTranslation() 사용
```

---

## 4. AdminPage Methods

### AdminPage (`src/app/admin/page.tsx`)
```typescript
// 통계 데이터 로드
loadStatistics(): Promise<LogStatistics>

// 산업별 분포 계산
calculateIndustryDistribution(logs: DemoLog[]): IndustryDistribution[]

// 세션 추이 계산
calculateSessionTrend(logs: DemoLog[]): SessionTrend[]

// 인기 아이디어 추출
extractPopularIdeas(logs: DemoLog[]): PopularIdea[]

interface LogStatistics {
  totalSessions: number
  completedSessions: number
  completionRate: number
  averageDuration: number
  recentLogs: DemoLog[]
}

interface IndustryDistribution {
  industry: string
  count: number
  percentage: number
}
```

---

## 5. 수정되는 기존 Methods

### StartPage (수정)
```typescript
// 기존
handleStart(projectIdea: string): void

// 추가
logSessionStart(sessionId: string, projectIdea: string): Promise<void>  // NEW
```

### ResultPage (수정)
```typescript
// 추가
logSessionComplete(sessionId: string, durationMs: number): Promise<void>  // NEW
handleEmailError(error: Error): void  // NEW - 에러 메시지 표시
```

### PhaseIndicator (수정)
```typescript
// phaseConfigs를 useMemo로 래핑
const phaseConfigs = useMemo(() => [...], [currentPhase, currentStage])
```

### API Routes 에러 응답 통일
```typescript
// 모든 API Route 공통 에러 응답 형식
interface ApiErrorResponse {
  success: false
  message: string      // 사용자 친화적 메시지
  error?: string       // 기술적 에러 상세 (개발용)
}

interface ApiSuccessResponse<T> {
  success: true
  data: T
}
```

---

## 6. 삭제 대상 Methods

### AIService (전체 삭제)
- ~~streamResponse()~~
- ~~generateContent()~~
- ~~buildPrompt()~~

### /api/demo/stream (전체 삭제)
### /api/demo/estimate (전체 삭제)
