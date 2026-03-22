# CR Cycle 2 - Domain Entities

## 1. ScenarioDefinition 확장

### 1.1 ScenarioDemoContent (신규 인터페이스)

```typescript
interface ScenarioDemoContent {
  /** 7개 데모 단계별 고유 AI 채팅 메시지 */
  stepMessages: ScenarioStepMessages[];
  /** 7개 데모 단계별 고유 파일 콘텐츠 (파일명은 공통) */
  stepFileContents: ScenarioStepFileContent[];
}

interface ScenarioStepMessages {
  /** 단계 인덱스 (0~6) */
  stepIndex: number;
  /** AI 메시지 배열 (사용자 응답은 공통 유지) */
  aiMessages: string[];
}

interface ScenarioStepFileContent {
  /** 단계 인덱스 (0~6) */
  stepIndex: number;
  /** 파일 콘텐츠 (마크다운 문자열) */
  fileContent: string;
}
```

### 1.2 ScenarioDefinition 확장 필드

```typescript
interface ScenarioDefinition {
  // ... 기존 필드 유지 ...
  
  /** 시나리오별 데모 콘텐츠 (Screen 2용) */
  demoContent: ScenarioDemoContent;
  
  /** Screen 3 탭별 시나리오 데이터 */
  resultData: ScenarioResultData;
}
```

### 1.3 ScenarioResultData (신규 인터페이스)

```typescript
interface ScenarioResultData {
  /** AWS Architecture 탭: Mermaid 다이어그램 키 */
  architectureKey: string;
  /** Business Workflow 탭: 시퀀스 다이어그램 키 */
  workflowKey: string;
  /** Estimate 탭: 고정 Estimate 템플릿 */
  estimateTemplate: ScenarioEstimateTemplate;
  /** AI-DLC Outputs 탭: 산출물 콘텐츠 */
  aidlcOutputs: ScenarioAIDLCOutputs;
  /** Kiro 소개 탭: 시나리오별 활용 사례 */
  kiroUseCases: ScenarioKiroUseCase[];
}
```

---

## 2. ScenarioEstimateTemplate (신규 인터페이스)

```typescript
interface ScenarioEstimateTemplate {
  developmentDays: number;
  teamSize: number;
  complexity: 'low' | 'medium' | 'high';
  teamComposition: TeamMember[];
  estimatedCost: CostEstimate;
  techStack: string[];
  aiSavedDays: number;
  aiSavedPercentage: number;
}
```

각 시나리오별 고정 값 예시:

| 시나리오 | 개발일수 | 팀규모 | 복잡도 | AI절감 |
|----------|----------|--------|--------|--------|
| ecommerce | 75 | 8 | high | 35일 (47%) |
| fintech | 90 | 10 | high | 40일 (44%) |
| healthcare | 80 | 9 | high | 36일 (45%) |
| education | 55 | 6 | medium | 22일 (40%) |
| logistics | 70 | 8 | high | 30일 (43%) |
| saas | 60 | 7 | medium | 25일 (42%) |
| chat | 45 | 5 | medium | 18일 (40%) |
| default | 50 | 6 | medium | 20일 (40%) |

---

## 3. ScenarioAIDLCOutputs (신규 인터페이스)

```typescript
interface ScenarioAIDLCOutputs {
  /** 산출물 목록 (5개 고정 구조, 콘텐츠만 시나리오별) */
  outputs: Record<string, {
    name: string;
    phase: string;
    content: string;
  }>;
}
```

산출물 파일명은 공통 (requirements.md, user-stories.md, components.md, api-spec.md, infrastructure.yaml), 내부 콘텐츠가 시나리오별로 다름.

---

## 4. ScenarioKiroUseCase (신규 인터페이스)

```typescript
interface ScenarioKiroUseCase {
  title: string;
  description: string;
}
```

KiroIntroTab 하단에 "이 프로젝트에서 Kiro 활용 사례" 섹션 추가. 시나리오별 2~3개 활용 사례 표시.

---

## 5. DemoSessionContext 확장

### 5.1 DemoSessionState 확장

```typescript
interface DemoSessionState {
  // ... 기존 필드 유지 ...
  
  /** 선택된 시나리오 ID */
  scenarioId: string;
}
```

### 5.2 Action 타입 추가

```typescript
type Action =
  // ... 기존 액션 유지 ...
  | { type: 'SET_SCENARIO_ID'; payload: string };
```

### 5.3 Context 메서드 추가

```typescript
interface DemoSessionContextType {
  // ... 기존 메서드 유지 ...
  setScenarioId: (scenarioId: string) => void;
}
```

---

## 6. URL Query Parameter 확장

### 6.1 Screen 1 -> Screen 2

```
/demo?idea={projectIdea}&scenario={scenarioId}
```

### 6.2 Screen 2 -> Screen 3

```
/result?idea={projectIdea}&scenario={scenarioId}
```

scenarioId가 URL에 없으면 detectScenario(idea)로 fallback.

---

## 7. MousePointer 스타일 엔티티

```typescript
interface MousePointerStyle {
  /** 기존 SVG 커서 유지 */
  showCursor: true;
  /** 노란색 원형 배경 */
  highlightCircle: {
    diameter: 40;           // px
    color: 'rgba(255, 215, 0, 0.3)';
    pulseAnimation: {
      scaleMin: 1.0;
      scaleMax: 1.3;
      duration: 1.5;        // seconds
      repeat: 'infinite';
    };
  };
}
```
