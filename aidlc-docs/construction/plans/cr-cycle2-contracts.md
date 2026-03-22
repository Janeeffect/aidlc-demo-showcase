# Contract/Interface Definition for CR Cycle 2

## Unit Context
- **Requirements**: CR-REQ-01~05 (시나리오 콘텐츠 분리, E2E 전달, 커서 개선, 파일 탐색기 수정, Screen 3 탭 분리)
- **Dependencies**: 기존 코드베이스 (29 suites, 240 tests)
- **Project Type**: Brownfield (Next.js 14 + TypeScript)

---

## Data Layer

### scenarios.ts 확장
- `ScenarioDemoContent`: 시나리오별 데모 콘텐츠 인터페이스
  - `stepMessages: ScenarioStepMessage[]`: 7단계별 AI 메시지
  - `stepFileContents: ScenarioStepFileContent[]`: 7단계별 파일 콘텐츠
- `ScenarioStepMessage`: `{ stepIndex: number; aiMessages: string[] }`
- `ScenarioStepFileContent`: `{ stepIndex: number; fileContent: string }`
- `ScenarioResultData`: Screen 3 탭별 시나리오 데이터
  - `architectureKey: string`
  - `workflowKey: string`
  - `estimateTemplate: ScenarioEstimateTemplate`
  - `aidlcOutputs: Record<string, { name: string; phase: string; content: string }>`
  - `kiroUseCases: { title: string; description: string }[]`
- `ScenarioEstimateTemplate`: 고정 Estimate 값
  - `developmentDays, teamSize, complexity, teamComposition, estimatedCost, techStack, aiSavedDays, aiSavedPercentage`
- `ScenarioDefinition` 확장: `demoContent?: ScenarioDemoContent`, `resultData?: ScenarioResultData`
- 각 SCENARIOS 항목에 `demoContent`, `resultData` 데이터 추가

### scenarioDetector.ts
- `getScenarioById(scenarioId: string): ScenarioDefinition`: scenarioId로 직접 조회
  - Args: scenarioId (string)
  - Returns: ScenarioDefinition (매칭 없으면 DEFAULT_SCENARIO)

---

## Context Layer

### DemoSessionContext.tsx 확장
- `DemoSessionState.scenarioId: string`: 선택된 시나리오 ID 필드
- `SET_SCENARIO_ID` 액션 타입 추가
- `setScenarioId(scenarioId: string)`: Context 메서드 추가

---

## Screen 1 Layer

### page.tsx (StartPage) 수정
- `handleStart()`: scenarioId 결정 후 URL에 `&scenario=` param 추가
  - `detectScenario(projectIdea).id`로 scenarioId 결정
  - `router.push(/demo?idea=...&scenario=...)`

---

## Screen 2 Layer

### demo/page.tsx (DemoPage) 수정
- scenarioId 획득: `searchParams.get('scenario') || detectScenario(idea).id`
- `generateDemoSteps(projectIdea, scenarioId)` 호출로 변경
- `handleFileClick(path)`: demoSteps 배열에서 fileName 매칭 -> fileContent 직접 표시
- 결과 이동: `router.push(/result?idea=...&scenario=...)`

### DemoStepGenerator.ts 수정
- `generateDemoSteps(projectIdea: string, scenarioId?: string): DemoStep[]`
  - scenarioId 있으면 `getScenarioById(scenarioId)` 사용
  - scenarioId 없으면 기존 `detectScenario(projectIdea)` fallback
  - AI 메시지 시나리오별 차별화 (사용자 응답은 공통)

---

## Screen 3 Layer

### result/page.tsx (ResultPage) 수정
- scenarioId 획득: `searchParams.get('scenario') || detectScenario(idea).id`
- `calculateEstimate(projectIdea, scenarioId)` 호출
- 각 탭 컴포넌트에 scenarioId prop 전달
- `AIDLCOutputsTab`: scenarioId 기반 산출물 콘텐츠 분기
- `KiroIntroTab`: scenarioId 기반 활용 사례 섹션 추가

### AWSArchitectureDiagram.tsx 수정
- Props: `scenarioId?: string` 추가
- `generateMermaidDiagram(idea, scenarioId?)`: scenarioId 기반 직접 매핑

### BusinessWorkflowDiagram.tsx 수정
- Props: `scenarioId?: string` 추가
- `generateSequence(idea, scenarioId?)`: scenarioId 기반 직접 매핑

### EstimateService.ts 수정
- `calculateEstimate(projectIdea: string, scenarioId?: string): ProjectEstimate`
  - scenarioId 있으면 `SCENARIO_ESTIMATE_TEMPLATES[scenarioId]` 반환
  - scenarioId 없으면 기존 키워드 분석 fallback

---

## Animation Layer

### MousePointer.tsx 수정
- 기존 SVG 커서 유지
- 노란색 원형 하이라이트 div 추가 (40px, rgba(255,215,0,0.3))
- 펄스 애니메이션 (scale 1.0->1.3->1.0, 1.5s, infinite)
