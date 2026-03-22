# Domain Entities - Unit 1: 코드 정리

## 1. 핵심 엔티티

### IndustryScenario
시나리오 감지 결과를 나타내는 도메인 엔티티.

```typescript
interface IndustryScenario {
  domain: string;                    // 산업 도메인명 (예: '이커머스 플랫폼')
  userTypes: string;                 // 대상 사용자 (예: '구매자/판매자')
  mainFeatures: string[];            // 주요 기능 목록 (5개)
  techStack: TechStack;              // 기술 스택
  nfrFocus: string;                  // NFR 핵심 포커스
  questions: ScenarioQuestion[];     // 데모용 질문 (3개)
  userStories: PersonaStories[];     // 페르소나별 스토리
  apiEndpoints: string[];            // API 엔드포인트 목록
  awsServices: string[];             // AWS 서비스 목록
}
```

### ScenarioDefinition (신규)
시나리오 데이터 파일에서 사용하는 확장 정의.

```typescript
interface ScenarioDefinition extends IndustryScenario {
  id: string;                        // 시나리오 고유 ID (예: 'ecommerce')
  keywords: string[];                // 매칭 키워드 (앞쪽이 높은 우선순위)
  priority: number;                  // 시나리오 우선순위 (동점 시 사용)
}
```

### TechStack
기술 스택 정보.

```typescript
interface TechStack {
  frontend: string;
  backend: string;
  db: string;
  extra: string;
}
```

### ScenarioQuestion
데모 중 표시되는 질문.

```typescript
interface ScenarioQuestion {
  q: string;                         // 질문 텍스트
  options: string[];                 // 선택지 (3개)
  answer: string;                    // 자동 선택 답변
}
```

### PersonaStories
페르소나별 사용자 스토리.

```typescript
interface PersonaStories {
  persona: string;                   // 페르소나명
  stories: string[];                 // 스토리 목록
}
```

---

## 2. 데모 실행 엔티티

### DemoStep
단일 데모 단계를 나타내는 엔티티.

```typescript
interface DemoStep {
  phase: Phase;                      // 'INCEPTION' | 'CONSTRUCTION' | 'OPERATIONS'
  stage: Stage;                      // 'requirements' | 'design' | 'code' | ...
  label: string;                     // 단계 표시명 (예: '요구사항 분석')
  fileName: string;                  // 생성될 파일 경로
  fileContent: string;               // 파일 내용 (Markdown)
  chatSequence: ChatMessage[];       // 채팅 메시지 시퀀스
}
```

### ChatMessage
채팅 메시지 엔티티.

```typescript
interface ChatMessage {
  id: string;                        // 고유 ID (순차 증가 또는 'complete-{idx}')
  type: 'ai' | 'user' | 'system';   // 메시지 유형
  content: string;                   // 메시지 내용
}
```

---

## 3. 상태 관리 엔티티

### DemoProgressState
데모 진행 상태.

```typescript
interface DemoProgressState {
  currentStep: number;               // 현재 단계 인덱스 (0-based)
  isAnimating: boolean;              // 단계 실행 중 여부
  stepCompleted: boolean;            // 현재 단계 완료 여부
}
```

### DemoProgressDerived (계산 값)

```typescript
interface DemoProgressDerived {
  progress: number;                  // 진행률 (0~100)
  isLastStep: boolean;               // 마지막 단계 여부
  canGoNext: boolean;                // 다음 이동 가능 여부
  canGoPrev: boolean;                // 이전 이동 가능 여부
}
```

---

## 4. 기존 엔티티 (수정 없음, 참조용)

### Phase (기존)
```typescript
type Phase = 'INCEPTION' | 'CONSTRUCTION' | 'OPERATIONS';
```

### Stage (기존)
```typescript
type Stage = 'requirements' | 'design' | 'code' | 'infrastructure' | 'deployment';
```

### FileTreeNode (기존)
```typescript
interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileTreeNode[];
  isExpanded?: boolean;
  isNew?: boolean;
}
```

---

## 5. 엔티티 관계도

```
ScenarioDefinition (데이터)
  |-- keywords, priority (매칭용)
  |-- IndustryScenario (결과)
        |-- TechStack
        |-- ScenarioQuestion[]
        |-- PersonaStories[]

DemoStep[] (7개)
  |-- Phase, Stage (메타)
  |-- ChatMessage[] (채팅 시퀀스)
  |-- fileName, fileContent (파일 생성)

DemoProgressState
  |-- currentStep -> DemoStep[currentStep]
  |-- DemoProgressDerived (계산)

FileTreeNode (파일 트리)
  |-- DemoStep.fileName에서 생성
```

---

## 6. 타입 파일 변경 계획

### src/types/demo.ts에 추가할 타입
- `ChatMessage` (DemoPage에서 이동)
- `DemoStep` (DemoPage에서 이동)

### src/data/scenarios.ts에 정의할 타입
- `ScenarioDefinition`
- `TechStack`
- `ScenarioQuestion`
- `PersonaStories`

### src/types/demo.ts에서 유지할 타입
- `Phase`, `Stage`, `FileTreeNode`, `DemoSessionState` 등 기존 타입 전부 유지

### 삭제할 타입
- DemoPage 내부의 `ChatMessage`, `DemoStep`, `IndustryScenario` 인터페이스 (외부로 이동)
