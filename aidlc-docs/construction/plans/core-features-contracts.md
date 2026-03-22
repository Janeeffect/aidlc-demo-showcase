# Contract/Interface Definition - Unit 2: 핵심 기능

## Unit Context
- **Stories**: US-A01~A07, US-D01, US-D02
- **Dependencies**: Unit 1 완료 (DemoStep, useRunStep, demoStepGenerator)
- **Database Entities**: 없음 (프론트엔드 전용)

---

## 1. Data Layer - 타입 확장

### DemoStep 확장 (src/types/demo.ts 수정)
```typescript
// 기존 DemoStep에 animationSequence 필드 추가
interface DemoStep {
  // ... 기존 필드 유지
  animationSequence: AnimationSequence; // NEW
}
```

### Animation Target 상수 (src/types/animation.ts 수정)
```typescript
const ANIMATION_TARGETS = {
  CHAT_INPUT: 'chat-input',
  SEND_BUTTON: 'send-button',
  NEXT_BUTTON: 'next-button',
  RESULT_BUTTON: 'result-button',
  EDITOR_TAB: 'editor-tab',
  EDITOR_CONTENT: 'editor-content',
  FILE_PREFIX: 'file-',
  PHASE_INDICATOR: 'phase-indicator',
} as const;

const FALLBACK_POSITIONS: Record<string, Position> = { ... };

function resolveTargetPosition(target: string): Position;
```

### ApiErrorResponse (src/types/api.ts 수정)
```typescript
interface ApiErrorResponse {
  success: false;
  message: string;
}
```

---

## 2. Business Logic Layer

### demoStepGenerator 확장 (src/utils/demoStepGenerator.ts 수정)
- `generateDemoSteps(projectIdea: string) -> DemoStep[]`
  - 기존 로직 유지 + 각 DemoStep에 animationSequence 생성
  - Returns: 7개 DemoStep (각각 AnimationSequence 포함)

### animationSequenceBuilder (신규 함수, demoStepGenerator 내부)
- `buildAnimationSequence(step: Partial<DemoStep>, stepIndex: number) -> AnimationSequence`
  - Args: step 데이터, stepIndex
  - Returns: 해당 단계의 AnimationSequence
  - 패턴: move(chat) -> type -> click(send) -> wait -> move(file) -> click(file) -> openFile -> scroll

### resolveTargetPosition (src/types/animation.ts)
- `resolveTargetPosition(target: string) -> Position`
  - Args: data-animation-target 값
  - Returns: DOM에서 계산된 좌표 또는 fallback 좌표
  - Raises: 없음 (항상 fallback 반환)

---

## 3. Component Layer

### AnimationOrchestrator 수정 (src/components/animation/AnimationOrchestrator.tsx)
- 기존 props 유지
- `resolveTargetPosition` 사용하여 move step에서 동적 좌표 계산
- data-animation-target 기반 DOM 쿼리

### KiroIDELayout 수정 (src/components/kiro-ide/KiroIDELayout.tsx)
- 주요 요소에 `data-animation-target` 속성 추가:
  - 채팅 입력 영역, 파일 탐색기 항목, 에디터 탭, 에디터 콘텐츠, 버튼들

### DemoPage 수정 (src/app/demo/page.tsx)
- AnimationOrchestrator 컴포넌트 추가
- useRunStep 콜백에서 animationSequence 전달

---

## 4. API Layer - 에러 응답 통일

### /api/demo/start (src/app/api/demo/start/route.ts 수정)
- 에러 응답: `{ success: false, message: "..." }`
- 성공 응답: 기존 유지 + `success: true` 추가

### /api/demo/send-report (src/app/api/demo/send-report/route.ts 수정)
- 에러 응답: `{ success: false, message: "리포트 전송에 실패했습니다" }`
- 성공 응답: 기존 유지

### /api/log (src/app/api/log/route.ts 수정)
- POST 에러: `{ success: false, message: "로그 기록에 실패했습니다" }`
- GET 에러: `{ success: false, message: "로그 조회에 실패했습니다" }`

---

## 5. UI Layer - 이메일 에러 피드백

### EmailReportModal 수정 (src/app/result/page.tsx 내부)
- `errorMessage` state 추가
- fetch 실패 시 에러 메시지 표시
- 재시도 시 에러 메시지 초기화

---

## Story Mapping

| Contract | Stories |
|----------|---------|
| DemoStep.animationSequence | US-A01~A07 |
| ANIMATION_TARGETS + resolveTargetPosition | US-A01, A02, A03 |
| buildAnimationSequence | US-A07 |
| AnimationOrchestrator 수정 | US-A01~A07 |
| KiroIDELayout data-attribute | US-A02, A03, A04, A05 |
| API 에러 응답 통일 | US-D02 |
| EmailReportModal 에러 피드백 | US-D01 |
