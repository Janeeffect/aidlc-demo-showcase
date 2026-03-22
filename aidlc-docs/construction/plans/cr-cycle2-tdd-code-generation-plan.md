# TDD Code Generation Plan for CR Cycle 2

## Unit Context
- **Project Type**: Brownfield (Next.js 14 + TypeScript)
- **Requirements**: CR-REQ-01~05
- **Existing Tests**: 29 suites, 240 tests
- **TDD Method**: RED-GREEN-REFACTOR

---

### Plan Step 0: Contract Skeleton & Data Layer Setup
- [x] scenarios.ts에 신규 인터페이스 추가 (ScenarioDemoContent, ScenarioResultData, ScenarioEstimateTemplate)
- [x] scenarioDetector.ts에 getScenarioById() stub 추가
- [x] DemoSessionContext.tsx에 scenarioId 필드 + SET_SCENARIO_ID 액션 stub 추가
- [x] 컴파일 확인

### Plan Step 1: Scenario Detection & Context (TDD)
- [x] getScenarioById() - RED-GREEN-REFACTOR
  - [x] RED: TC-CR-001 (유효한 scenarioId 조회)
  - [x] GREEN: 최소 구현
  - [x] RED: TC-CR-002 (유효하지 않은 scenarioId -> DEFAULT_SCENARIO)
  - [x] GREEN: fallback 구현
  - [x] REFACTOR: 코드 정리
  - [x] VERIFY: 모든 테스트 통과
- [x] DemoSessionContext scenarioId - RED-GREEN-REFACTOR
  - [x] RED: TC-CR-007 (SET_SCENARIO_ID 액션)
  - [x] GREEN: reducer + context 메서드 구현
  - [x] VERIFY: 모든 테스트 통과

### Plan Step 2: DemoStepGenerator 시나리오 분기 (TDD)
- [x] generateDemoSteps(idea, scenarioId) - RED-GREEN-REFACTOR
  - [x] RED: TC-CR-003 (scenarioId 전달 시 해당 시나리오 기반 생성)
  - [x] GREEN: scenarioId 기반 시나리오 조회 + 기존 로직 활용
  - [x] RED: TC-CR-004 (scenarioId 없이 호출 시 fallback)
  - [x] GREEN: fallback 로직
  - [x] RED: TC-CR-005 (시나리오별 AI 메시지 차별화)
  - [x] GREEN: AI 메시지 시나리오별 분기
  - [x] RED: TC-CR-006 (시나리오별 파일 콘텐츠 차별화)
  - [x] GREEN: 파일 콘텐츠 시나리오별 분기
  - [x] REFACTOR: 코드 정리
  - [x] VERIFY: 모든 테스트 통과
- [x] 8개 시나리오 + default 시나리오 demoContent 데이터 추가
  - [x] scenarios.ts에 각 시나리오별 stepMessages, stepFileContents 데이터 작성 (DemoStepGenerator가 시나리오 필드 기반 동적 생성)

### Plan Step 3: Screen 1 & Screen 2 수정 (TDD)
- [x] Screen 1 handleStart scenarioId 전달 - RED-GREEN-REFACTOR
  - [x] RED: TC-CR-008 (URL에 scenario param 포함)
  - [x] GREEN: detectScenario().id로 scenarioId 결정, URL에 추가
  - [x] VERIFY: 테스트 통과
- [x] Screen 2 파일 탐색기 수정 - RED-GREEN-REFACTOR
  - [x] RED: TC-CR-009 (파일 클릭 시 demoSteps 매칭 fileContent)
  - [x] GREEN: handleFileClick 로직 수정
  - [x] RED: TC-CR-010 (이전 단계 파일 정확한 콘텐츠)
  - [x] GREEN: demoSteps.find() 로직
  - [x] REFACTOR: 코드 정리
  - [x] VERIFY: 모든 테스트 통과
- [x] Screen 2 scenarioId 획득 및 결과 이동 URL 수정
  - [x] searchParams.get('scenario') 추가
  - [x] result 이동 시 scenario param 유지

### Plan Step 4: MousePointer 시각적 개선 (TDD)
- [x] MousePointer 노란색 하이라이트 - RED-GREEN-REFACTOR
  - [x] RED: TC-CR-011 (노란색 원형 div 존재)
  - [x] GREEN: 40px 노란색 원형 div 추가
  - [x] RED: TC-CR-012 (펄스 애니메이션 적용)
  - [x] GREEN: framer-motion animate 속성 추가
  - [x] REFACTOR: 코드 정리
  - [x] VERIFY: 모든 테스트 통과

### Plan Step 5: Screen 3 탭별 시나리오 분기 (TDD)
- [x] AWSArchitectureDiagram scenarioId 분기 - RED-GREEN-REFACTOR
  - [x] RED: TC-CR-013 (scenarioId 전달 시 해당 아키텍처)
  - [x] GREEN: scenarioId 기반 매핑 테이블 + generateMermaidDiagram 수정
  - [x] VERIFY: 테스트 통과
- [x] BusinessWorkflowDiagram scenarioId 분기 - RED-GREEN-REFACTOR
  - [x] RED: TC-CR-014 (scenarioId 전달 시 해당 시퀀스)
  - [x] GREEN: scenarioId 기반 매핑 테이블 + generateSequence 수정
  - [x] VERIFY: 테스트 통과
- [x] EstimateService scenarioId 분기 - RED-GREEN-REFACTOR
  - [x] RED: TC-CR-015 (scenarioId 전달 시 고정 Estimate)
  - [x] GREEN: SCENARIO_ESTIMATE_TEMPLATES 매핑 + calculateEstimate 수정
  - [x] RED: TC-CR-016 (동일 scenarioId 반복 호출 시 동일 결과)
  - [x] GREEN: 랜덤 요소 제거 확인
  - [x] RED: TC-CR-017 (scenarioId 없이 호출 시 fallback)
  - [x] GREEN: 기존 로직 유지 확인
  - [x] REFACTOR: 코드 정리
  - [x] VERIFY: 모든 테스트 통과
- [x] AIDLCOutputsTab scenarioId 분기 - RED-GREEN-REFACTOR
  - [x] RED: TC-CR-018 (시나리오별 산출물 콘텐츠)
  - [x] GREEN: scenarioId prop + 콘텐츠 분기 구현
  - [x] VERIFY: 테스트 통과
- [x] KiroIntroTab scenarioId 분기 - RED-GREEN-REFACTOR
  - [x] RED: TC-CR-019 (시나리오별 활용 사례)
  - [x] GREEN: scenarioId prop + 활용 사례 섹션 추가
  - [x] VERIFY: 테스트 통과
- [x] 8개 시나리오 + default resultData 데이터 추가
  - [x] scenarios.ts에 각 시나리오별 estimateTemplate, aidlcOutputs, kiroUseCases 데이터 작성

### Plan Step 6: E2E 일관성 검증 & 최종 확인
- [x] RED: TC-CR-020 (시나리오 E2E 일관성)
- [x] GREEN: 전체 흐름 검증
- [x] 전체 테스트 실행 (기존 240 + 신규 40 = 280 tests)
- [x] next build 확인
- [x] Code Summary 생성: aidlc-docs/construction/cr-cycle2/code/code-summary.md
- [x] Plan 체크박스 최종 업데이트
