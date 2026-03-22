# CR Cycle 3 - Domain Entities

## 변경 대상 엔티티

### 1. FileContentMapping (CR-05 신규 개념)

파일 경로와 콘텐츠의 1:1 매핑을 보장하는 데이터 구조.

```typescript
// 기존: Record<string, string> (fileContentsMap)
// 변경: 동일 타입이지만 초기화 로직 변경

// onFileAdd 시점에 step.fileContent를 즉시 저장
type FileContentsMap = Record<string, string>;
```

### 2. ChatMessage (CR-07 기존 유지)

```typescript
interface ChatMessage {
  id: string;
  type: 'ai' | 'user' | 'system';
  content: string;
}
```
타입 변경 없음. 메시지 수만 증가 (단계당 3~4개 -> 8~12개).

### 3. DemoStep (CR-07 기존 유지)

```typescript
interface DemoStep {
  phase: Phase;
  stage: Stage;
  label: string;
  fileName: string;
  fileContent: string;
  chatSequence: ChatMessage[];
  animationSequence: AnimationSequence;
}
```
타입 변경 없음. chatSequence 배열 크기만 증가.

### 4. MousePointer 관련 (CR-06 삭제)

삭제 대상:
- `MousePointerProps` interface
- `MousePointer` component
- `Position` type (animation.ts에서 다른 곳 사용 여부 확인 후 결정)

### 5. ScenarioDefinition (CR-08 기존 유지)

```typescript
interface ScenarioDefinition {
  // ... 기존 필드 유지
  resultData?: ScenarioResultData;  // 이미 정의되어 있으나 미사용
}
```
`resultData` 필드를 활용하여 시나리오별 결과 콘텐츠 제공 가능.
현재 scenarios.ts에 `resultData`가 정의되어 있지 않으므로 추가 필요.

### 6. ProjectEstimate (CR-08 기존 유지)

```typescript
interface ProjectEstimate {
  developmentDays: number;
  teamSize: number;
  complexity: 'low' | 'medium' | 'high';
  teamComposition: { role: string; count: number; seniorityLevel: string }[];
  estimatedCost: { monthly: { min: number; max: number }; development: { min: number; max: number }; currency: string };
  techStack: string[];
  aiSavedDays: number;
  aiSavedPercentage: number;
}
```
타입 변경 없음. 리스크 요소 등은 UI 레벨에서 추가.

---

## 삭제 대상 파일 목록

| 파일 | 사유 |
|------|------|
| `src/components/animation/MousePointer.tsx` | CR-06 기능 삭제 |
| `src/__tests__/MousePointerHighlight.test.tsx` | CR-06 관련 테스트 삭제 |

## 수정 대상 파일 목록

| 파일 | CR | 수정 내용 |
|------|-----|-----------|
| `src/app/demo/page.tsx` | CR-05, CR-06 | handleFileClick 로직 수정, MousePointer 참조 제거 (있는 경우) |
| `src/hooks/useRunStep.ts` | CR-05, CR-09 | onFileAdd 콜백에 fileContent 전달, 안내 문구 수정 |
| `src/utils/demoStepGenerator.ts` | CR-07 | chatSequence 대폭 확장 (8+ 메시지/단계) |
| `src/app/result/page.tsx` | CR-08 | AIDLCOutputsTab scenarioId 기반 분기 |
| `src/components/ui/AWSArchitectureDiagram.tsx` | CR-08 | 보안/모니터링 레이어 추가 |
| `src/components/ui/BusinessWorkflowDiagram.tsx` | CR-08 | 예외 처리/에러 핸들링 시퀀스 추가 |
| `src/services/EstimateService.ts` | CR-08 | 상세 비용 분석 강화 |
| `src/app/layout.tsx` | CR-10 | Google Fonts -> local font 전환 |
| `src/app/page.tsx` | CR-10 | framer-motion 최적화 |
