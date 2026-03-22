# Contract/Interface Definition - Unit 1: 코드 정리

## Unit Context
- **Stories**: US-B01, US-B02, US-B03, US-B04, US-I01, US-I02, US-I03
- **Dependencies**: None (첫 번째 Unit)
- **Database Entities**: None (In-memory)
- **Requirements**: REQ-B02, REQ-B03

---

## 1. Data Layer

### scenarios.ts (`src/data/scenarios.ts`)

```typescript
export interface TechStack {
  frontend: string;
  backend: string;
  db: string;
  extra: string;
}

export interface ScenarioQuestion {
  q: string;
  options: string[];
  answer: string;
}

export interface PersonaStories {
  persona: string;
  stories: string[];
}

export interface ScenarioDefinition {
  id: string;
  keywords: string[];       // 앞쪽 키워드가 높은 우선순위 (가중치 1.5)
  priority: number;          // 동점 시 시나리오 우선순위
  domain: string;
  userTypes: string;
  mainFeatures: string[];
  techStack: TechStack;
  nfrFocus: string;
  questions: ScenarioQuestion[];
  userStories: PersonaStories[];
  apiEndpoints: string[];
  awsServices: string[];
}

export const SCENARIOS: ScenarioDefinition[];
export const DEFAULT_SCENARIO: ScenarioDefinition;
```

---

## 2. Business Logic Layer

### ScenarioDetector (`src/utils/scenarioDetector.ts`)

```typescript
import { ScenarioDefinition } from '@/data/scenarios';

/**
 * 사용자 입력 텍스트를 분석하여 최적의 산업 시나리오를 반환
 * @param idea - 사용자가 입력한 프로젝트 아이디어 텍스트
 * @returns ScenarioDefinition - 매칭된 시나리오 (매칭 없으면 default)
 */
export function detectScenario(idea: string): ScenarioDefinition;

/**
 * 시나리오별 매칭 점수를 계산 (테스트용 export)
 * @param idea - 소문자 변환된 입력 텍스트
 * @param scenario - 점수를 계산할 시나리오
 * @returns number - 매칭 점수 (0 이상)
 */
export function calculateMatchScore(idea: string, scenario: ScenarioDefinition): number;
```

### DemoStepGenerator (`src/utils/demoStepGenerator.ts`)

```typescript
import { DemoStep, ChatMessage } from '@/types/demo';

/**
 * 프로젝트 아이디어 기반 7개 데모 단계 생성
 * @param projectIdea - 사용자 입력 프로젝트 아이디어
 * @returns DemoStep[] - 7개 데모 단계 배열
 */
export function generateDemoSteps(projectIdea: string): DemoStep[];
```

---

## 3. Hook Layer

### useDemoProgress (`src/hooks/useDemoProgress.ts`)

```typescript
export interface UseDemoProgressReturn {
  currentStep: number;
  isAnimating: boolean;
  stepCompleted: boolean;
  progress: number;
  isLastStep: boolean;
  canGoNext: boolean;
  canGoPrev: boolean;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  setIsAnimating: (v: boolean) => void;
  setStepCompleted: (v: boolean) => void;
}

/**
 * 데모 진행 상태 관리 훅
 * @param totalSteps - 전체 단계 수
 * @param onComplete - 마지막 단계 완료 시 콜백
 * @returns UseDemoProgressReturn
 */
export function useDemoProgress(
  totalSteps: number,
  onComplete: () => void
): UseDemoProgressReturn;
```

### useRunStep (`src/hooks/useRunStep.ts`)

```typescript
import { DemoStep, ChatMessage, FileTreeNode, Phase, Stage } from '@/types/demo';

export interface RunStepCallbacks {
  onChatReset: (messages: ChatMessage[]) => void;
  onChatMessage: (msg: ChatMessage) => void;
  onFileAdd: (file: FileTreeNode) => void;
  onEditorContent: (content: string) => void;
  onActiveFile: (path: string) => void;
  onPhaseChange: (phase: Phase, stage: Stage) => void;
  onProgress: (progress: number) => void;
  onStepComplete: () => void;
  onAnimatingChange: (v: boolean) => void;
  onTypingChange: (v: boolean) => void;
}

export interface UseRunStepReturn {
  runStep: (stepIdx: number) => Promise<void>;
  cancelCurrentRun: () => void;
}

/**
 * 단일 데모 단계 비동기 실행 훅
 * @param demoSteps - 전체 데모 단계 배열
 * @param callbacks - 상태 변경 콜백
 * @returns UseRunStepReturn
 */
export function useRunStep(
  demoSteps: DemoStep[],
  callbacks: RunStepCallbacks
): UseRunStepReturn;
```

---

## 4. Type Extensions (`src/types/demo.ts` 추가)

```typescript
// DemoPage에서 이동
export interface ChatMessage {
  id: string;
  type: 'ai' | 'user' | 'system';
  content: string;
}

export interface DemoStep {
  phase: Phase;
  stage: Stage;
  label: string;
  fileName: string;
  fileContent: string;
  chatSequence: ChatMessage[];
}
```

---

## 5. 삭제 대상

```
DELETE: src/app/api/demo/stream/route.ts
DELETE: src/app/api/demo/estimate/route.ts
DELETE: src/services/AIService.ts
```

---

## 6. 수정 대상

### LogService 연동 (`src/services/LogService.ts`)
- 변경 없음 (이미 구현됨)

### StartPage (`src/app/page.tsx`)
```typescript
// 추가: 데모 시작 시 fire-and-forget 로그
// logService.logStart(sessionId, projectIdea).catch(() => {});
```

### ResultPage (`src/app/result/page.tsx`)
```typescript
// 추가: 결과 페이지 진입 시 fire-and-forget 로그
// logService.logComplete(sessionId, projectIdea, durationMs).catch(() => {});
```

### DemoPage (`src/app/demo/page.tsx`)
```typescript
// 리팩토링: 548 라인 -> 200 라인 이하
// 모든 비즈니스 로직을 외부 모듈로 분리
// 조합(composition)만 담당
```
