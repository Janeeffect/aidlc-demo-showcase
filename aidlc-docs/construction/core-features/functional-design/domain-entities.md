# Domain Entities - Unit 2: 핵심 기능

## 1. Animation 관련 엔티티 (기존 확장)

### AnimationStep (기존 - src/types/animation.ts)
```typescript
interface AnimationStep {
  id: string;
  type: AnimationStepType; // 'move' | 'click' | 'type' | 'wait' | 'createFile' | 'openFile' | 'scroll'
  target?: string;         // data-animation-target 값 또는 파일 경로
  position?: Position;     // fallback 좌표
  content?: string;        // type step의 텍스트
  duration: number;        // ms
  delay?: number;          // step 시작 전 대기 ms
}
```

### AnimationSequence (기존 - src/types/animation.ts)
```typescript
interface AnimationSequence {
  id: string;
  phase: string;
  stage: string;
  steps: AnimationStep[];
}
```

### DemoStep (확장 - src/types/demo.ts)
```typescript
interface DemoStep {
  phase: Phase;
  stage: Stage;
  label: string;
  fileName: string;
  fileContent: string;
  chatSequence: ChatMessage[];
  animationSequence: AnimationSequence; // [NEW] Unit 2에서 추가
}
```

## 2. Animation Target 상수

### AnimationTargets (신규)
```typescript
const ANIMATION_TARGETS = {
  CHAT_INPUT: 'chat-input',
  SEND_BUTTON: 'send-button',
  NEXT_BUTTON: 'next-button',
  RESULT_BUTTON: 'result-button',
  EDITOR_TAB: 'editor-tab',
  EDITOR_CONTENT: 'editor-content',
  FILE_PREFIX: 'file-',        // file-{path} 형태로 사용
  PHASE_INDICATOR: 'phase-indicator',
} as const;
```

### Fallback 좌표 (신규)
```typescript
const FALLBACK_POSITIONS: Record<string, Position> = {
  'chat-input': { x: 900, y: 600 },
  'send-button': { x: 1050, y: 600 },
  'next-button': { x: 640, y: 700 },
  'result-button': { x: 640, y: 700 },
  'editor-tab': { x: 500, y: 150 },
  'editor-content': { x: 500, y: 400 },
  'file-default': { x: 100, y: 300 },
};
```

## 3. 에러 응답 엔티티

### ApiErrorResponse (신규 - src/types/api.ts)
```typescript
interface ApiErrorResponse {
  success: false;
  message: string;
}

interface ApiSuccessResponse<T = unknown> {
  success: true;
  data?: T;
  [key: string]: unknown;
}
```

## 4. 이메일 모달 에러 상태

### EmailModalState (ResultPage 내부)
```typescript
// 기존 상태에 추가
const [errorMessage, setErrorMessage] = useState<string | null>(null);
```

## 5. 엔티티 관계도

```
DemoStep 1 --- 1 AnimationSequence
AnimationSequence 1 --- N AnimationStep
AnimationStep --- uses --> ANIMATION_TARGETS (data-attribute)
AnimationStep --- fallback --> FALLBACK_POSITIONS

KiroIDELayout --- has --> data-animation-target attributes
AnimationOrchestrator --- reads --> data-animation-target (DOM query)
AnimationOrchestrator --- renders --> MousePointer

API Routes --- returns --> ApiErrorResponse | ApiSuccessResponse
EmailReportModal --- displays --> errorMessage
```
