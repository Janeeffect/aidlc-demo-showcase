# Test Plan for CR Cycle 2

## Unit Overview
- **Unit**: cr-cycle2
- **Requirements**: CR-REQ-01~05
- **Existing Tests**: 29 suites, 240 tests (회귀 방지 필수)

---

## 1. Scenario Data & Detection Tests

### getScenarioById()
- **TC-CR-001**: 유효한 scenarioId로 시나리오 조회
  - Given: scenarioId = 'ecommerce'
  - When: getScenarioById('ecommerce') 호출
  - Then: ecommerce ScenarioDefinition 반환
  - Req: CR-REQ-02
  - Status: Not Started

- **TC-CR-002**: 유효하지 않은 scenarioId로 조회 시 DEFAULT_SCENARIO 반환
  - Given: scenarioId = 'invalid'
  - When: getScenarioById('invalid') 호출
  - Then: DEFAULT_SCENARIO 반환
  - Req: CR-REQ-02
  - Status: Not Started

---

## 2. DemoStepGenerator Tests

### generateDemoSteps(idea, scenarioId)
- **TC-CR-003**: scenarioId 전달 시 해당 시나리오 기반 DemoStep 생성
  - Given: projectIdea = '온라인 쇼핑몰', scenarioId = 'ecommerce'
  - When: generateDemoSteps(idea, 'ecommerce') 호출
  - Then: 7개 DemoStep 반환, 이커머스 도메인 콘텐츠 포함
  - Req: CR-REQ-01
  - Status: Not Started

- **TC-CR-004**: scenarioId 없이 호출 시 기존 detectScenario fallback
  - Given: projectIdea = '온라인 쇼핑몰'
  - When: generateDemoSteps(idea) 호출 (scenarioId 없음)
  - Then: 7개 DemoStep 반환, detectScenario 기반 콘텐츠
  - Req: CR-REQ-01
  - Status: Not Started

- **TC-CR-005**: 시나리오별 AI 메시지 차별화 확인
  - Given: scenarioId = 'ecommerce' vs 'fintech'
  - When: 각각 generateDemoSteps 호출
  - Then: chatSequence의 AI 메시지가 서로 다름
  - Req: CR-REQ-01
  - Status: Not Started

- **TC-CR-006**: 시나리오별 파일 콘텐츠 차별화 확인
  - Given: scenarioId = 'ecommerce' vs 'fintech'
  - When: 각각 generateDemoSteps 호출
  - Then: fileContent에 각 시나리오 도메인 정보 포함
  - Req: CR-REQ-01
  - Status: Not Started

---

## 3. DemoSessionContext Tests

### scenarioId 상태 관리
- **TC-CR-007**: SET_SCENARIO_ID 액션으로 scenarioId 설정
  - Given: 초기 상태 (scenarioId = '')
  - When: dispatch SET_SCENARIO_ID 'ecommerce'
  - Then: state.scenarioId === 'ecommerce'
  - Req: CR-REQ-02
  - Status: Not Started

---

## 4. Screen 1 (StartPage) Tests

### handleStart scenarioId 전달
- **TC-CR-008**: 시나리오 선택 후 시작 시 URL에 scenario param 포함
  - Given: projectIdea = '온라인 쇼핑몰'
  - When: handleStart() 호출
  - Then: router.push에 '&scenario=ecommerce' 포함
  - Req: CR-REQ-02
  - Status: Not Started

---

## 5. File Explorer Content Tests

### handleFileClick 수정
- **TC-CR-009**: 파일 클릭 시 demoSteps에서 매칭된 fileContent 표시
  - Given: demoSteps에 fileName='aidlc-docs/inception/requirements.md' 존재
  - When: handleFileClick('aidlc-docs/inception/requirements.md')
  - Then: 해당 step의 fileContent가 editorContent에 설정
  - Req: CR-REQ-04
  - Status: Not Started

- **TC-CR-010**: 이전 단계 파일 클릭 시 정확한 콘텐츠 표시
  - Given: 3번째 단계 진행 중, 1번째 단계 파일 클릭
  - When: handleFileClick(step0.fileName)
  - Then: step0.fileContent 표시 (step2.fileContent가 아님)
  - Req: CR-REQ-04
  - Status: Not Started

---

## 6. MousePointer Tests

### 시각적 개선
- **TC-CR-011**: 노란색 원형 하이라이트 렌더링
  - Given: MousePointer visible
  - When: 렌더링
  - Then: 40px 노란색 원형 div 존재, SVG 커서도 존재
  - Req: CR-REQ-03
  - Status: Not Started

- **TC-CR-012**: 펄스 애니메이션 적용 확인
  - Given: MousePointer visible
  - When: 렌더링
  - Then: 원형 div에 animate 속성 (scale 변화) 존재
  - Req: CR-REQ-03
  - Status: Not Started

---

## 7. Screen 3 Tab Tests

### AWSArchitectureDiagram scenarioId 분기
- **TC-CR-013**: scenarioId 전달 시 해당 시나리오 아키텍처 표시
  - Given: scenarioId = 'fintech'
  - When: AWSArchitectureDiagram 렌더링
  - Then: 금융 보안 아키텍처 관련 서비스 목록 표시 (KMS, Aurora 등)
  - Req: CR-REQ-05
  - Status: Not Started

### BusinessWorkflowDiagram scenarioId 분기
- **TC-CR-014**: scenarioId 전달 시 해당 시나리오 시퀀스 표시
  - Given: scenarioId = 'fintech'
  - When: BusinessWorkflowDiagram 렌더링
  - Then: 송금 처리 시퀀스 관련 액터/단계 표시
  - Req: CR-REQ-05
  - Status: Not Started

### EstimateService scenarioId 분기
- **TC-CR-015**: scenarioId 전달 시 고정 Estimate 반환
  - Given: scenarioId = 'ecommerce'
  - When: calculateEstimate(idea, 'ecommerce') 호출
  - Then: 고정 값 반환 (developmentDays=75, teamSize=8 등)
  - Req: CR-REQ-05
  - Status: Not Started

- **TC-CR-016**: 동일 scenarioId로 반복 호출 시 동일 결과
  - Given: scenarioId = 'ecommerce'
  - When: calculateEstimate 2회 호출
  - Then: 두 결과가 동일 (랜덤 요소 없음)
  - Req: CR-REQ-05
  - Status: Not Started

- **TC-CR-017**: scenarioId 없이 호출 시 기존 키워드 분석 fallback
  - Given: projectIdea = '온라인 쇼핑몰'
  - When: calculateEstimate(idea) 호출 (scenarioId 없음)
  - Then: 기존 키워드 분석 기반 결과 반환
  - Req: CR-REQ-05
  - Status: Not Started

### AIDLCOutputsTab scenarioId 분기
- **TC-CR-018**: scenarioId 전달 시 시나리오별 산출물 콘텐츠 표시
  - Given: scenarioId = 'ecommerce'
  - When: AIDLCOutputsTab 렌더링
  - Then: 산출물 콘텐츠에 이커머스 도메인 정보 포함
  - Req: CR-REQ-05
  - Status: Not Started

### KiroIntroTab scenarioId 분기
- **TC-CR-019**: scenarioId 전달 시 시나리오별 활용 사례 표시
  - Given: scenarioId = 'ecommerce'
  - When: KiroIntroTab 렌더링
  - Then: 이커머스 관련 Kiro 활용 사례 섹션 존재
  - Req: CR-REQ-05
  - Status: Not Started

---

## 8. E2E Scenario Consistency Tests

- **TC-CR-020**: 시나리오 End-to-End 일관성 (ecommerce)
  - Given: scenarioId = 'ecommerce'
  - When: DemoSteps + Architecture + Workflow + Estimate + Outputs 모두 확인
  - Then: 모든 콘텐츠가 이커머스 도메인 관련
  - Req: CR-REQ-02, CR-REQ-05
  - Status: Not Started

---

## Requirements Coverage

| Requirement | Test Cases | Status |
|-------------|------------|--------|
| CR-REQ-01 | TC-CR-003~006 | Pending |
| CR-REQ-02 | TC-CR-001~002, TC-CR-007~008, TC-CR-020 | Pending |
| CR-REQ-03 | TC-CR-011~012 | Pending |
| CR-REQ-04 | TC-CR-009~010 | Pending |
| CR-REQ-05 | TC-CR-013~019 | Pending |
