# Test Plan - Unit 1: 코드 정리

## Unit Overview
- **Unit**: code-cleanup
- **Stories**: US-B01, US-B02, US-B03, US-B04, US-I01, US-I02, US-I03
- **Requirements**: REQ-B02, REQ-B03

---

## 1. ScenarioDetector Tests (`src/__tests__/ScenarioDetector.test.ts`)

### detectScenario()

- **TC-CU-001**: 이커머스 키워드 매칭
  - Given: idea = "온라인 쇼핑몰 만들고 싶어"
  - When: detectScenario(idea) 호출
  - Then: 반환된 시나리오의 id가 'ecommerce'
  - Story: US-B01
  - Status: ⬜ Not Started

- **TC-CU-002**: 핀테크 키워드 매칭
  - Given: idea = "간편 송금 서비스"
  - When: detectScenario(idea) 호출
  - Then: 반환된 시나리오의 id가 'fintech'
  - Story: US-B01
  - Status: ⬜ Not Started

- **TC-CU-003**: 헬스케어 키워드 매칭
  - Given: idea = "원격 진료 플랫폼"
  - When: detectScenario(idea) 호출
  - Then: 반환된 시나리오의 id가 'healthcare'
  - Story: US-B01
  - Status: ⬜ Not Started

- **TC-CU-004**: 매칭 없는 입력 시 기본 시나리오 반환
  - Given: idea = "아무거나 만들어줘"
  - When: detectScenario(idea) 호출
  - Then: 반환된 시나리오의 id가 'default'
  - Story: US-B01
  - Status: ⬜ Not Started

- **TC-CU-005**: 빈 문자열 입력 시 기본 시나리오 반환
  - Given: idea = ""
  - When: detectScenario(idea) 호출
  - Then: 반환된 시나리오의 id가 'default'
  - Story: US-B01
  - Status: ⬜ Not Started

### calculateMatchScore()

- **TC-CU-006**: 키워드 가중치 매칭 - 우선 키워드 가중치 1.5
  - Given: idea에 시나리오의 첫 번째 키워드(우선)가 포함
  - When: calculateMatchScore(idea, scenario) 호출
  - Then: 점수가 1.5 (우선 키워드 1개 매칭)
  - Story: US-B01
  - Status: ⬜ Not Started

- **TC-CU-007**: 키워드 가중치 매칭 - 일반 키워드 가중치 1.0
  - Given: idea에 시나리오의 마지막 키워드(일반)만 포함
  - When: calculateMatchScore(idea, scenario) 호출
  - Then: 점수가 1.0 (일반 키워드 1개 매칭)
  - Story: US-B01
  - Status: ⬜ Not Started

- **TC-CU-008**: 복수 키워드 매칭 시 점수 합산
  - Given: idea에 우선 키워드 1개 + 일반 키워드 2개 포함
  - When: calculateMatchScore(idea, scenario) 호출
  - Then: 점수가 3.5 (1.5 + 1.0 + 1.0)
  - Story: US-B01
  - Status: ⬜ Not Started

- **TC-CU-009**: 매칭 키워드 없으면 점수 0
  - Given: idea에 시나리오 키워드가 하나도 없음
  - When: calculateMatchScore(idea, scenario) 호출
  - Then: 점수가 0
  - Story: US-B01
  - Status: ⬜ Not Started

---

## 2. DemoStepGenerator Tests (`src/__tests__/DemoStepGenerator.test.ts`)

### generateDemoSteps()

- **TC-CU-010**: 항상 7개 단계 생성
  - Given: projectIdea = "온라인 쇼핑몰"
  - When: generateDemoSteps(projectIdea) 호출
  - Then: 반환 배열 길이가 7
  - Story: US-B02
  - Status: ⬜ Not Started

- **TC-CU-011**: Phase 순서 검증 (INCEPTION -> CONSTRUCTION -> OPERATIONS)
  - Given: 생성된 7개 단계
  - When: phase 순서 확인
  - Then: INCEPTION이 먼저, CONSTRUCTION 다음, OPERATIONS 마지막
  - Story: US-B02
  - Status: ⬜ Not Started

- **TC-CU-012**: 모든 파일명 고유성 검증
  - Given: 생성된 7개 단계
  - When: fileName 중복 확인
  - Then: 모든 fileName이 고유
  - Story: US-B02
  - Status: ⬜ Not Started

- **TC-CU-013**: 모든 chatMessage ID 고유성 검증
  - Given: 생성된 7개 단계의 모든 chatSequence
  - When: id 중복 확인
  - Then: 모든 id가 고유
  - Story: US-B02
  - Status: ⬜ Not Started

- **TC-CU-014**: 시나리오 데이터가 fileContent에 반영
  - Given: projectIdea = "온라인 쇼핑몰" (이커머스 시나리오)
  - When: generateDemoSteps(projectIdea) 호출
  - Then: 첫 번째 단계 fileContent에 '이커머스' 관련 내용 포함
  - Story: US-B02
  - Status: ⬜ Not Started

- **TC-CU-015**: 빈 입력에도 유효한 단계 생성
  - Given: projectIdea = ""
  - When: generateDemoSteps(projectIdea) 호출
  - Then: 7개 유효한 단계 반환 (기본 시나리오 사용)
  - Story: US-B02
  - Status: ⬜ Not Started

---

## 3. useDemoProgress Tests (`src/__tests__/useDemoProgress.test.ts`)

### 초기 상태

- **TC-CU-016**: 초기 상태 검증
  - Given: useDemoProgress(7, onComplete) 호출
  - When: 초기 렌더링
  - Then: currentStep=0, isAnimating=false, stepCompleted=false, progress=14
  - Story: US-B03
  - Status: ⬜ Not Started

### handleNextStep()

- **TC-CU-017**: 다음 단계 이동
  - Given: stepCompleted=true, isAnimating=false
  - When: handleNextStep() 호출
  - Then: currentStep이 1 증가, stepCompleted=false
  - Story: US-B03
  - Status: ⬜ Not Started

- **TC-CU-018**: 애니메이션 중 다음 이동 차단
  - Given: isAnimating=true
  - When: handleNextStep() 호출
  - Then: currentStep 변경 없음
  - Story: US-B03
  - Status: ⬜ Not Started

- **TC-CU-019**: 마지막 단계에서 onComplete 콜백 호출
  - Given: currentStep=6 (마지막), stepCompleted=true
  - When: handleNextStep() 호출
  - Then: onComplete 콜백이 호출됨
  - Story: US-B03
  - Status: ⬜ Not Started

### handlePrevStep()

- **TC-CU-020**: 이전 단계 이동
  - Given: currentStep=3, isAnimating=false
  - When: handlePrevStep() 호출
  - Then: currentStep이 1 감소
  - Story: US-B03
  - Status: ⬜ Not Started

- **TC-CU-021**: 첫 단계에서 이전 이동 차단
  - Given: currentStep=0
  - When: handlePrevStep() 호출
  - Then: currentStep 변경 없음 (0 유지)
  - Story: US-B03
  - Status: ⬜ Not Started

### Derived 값

- **TC-CU-022**: progress 계산 검증
  - Given: totalSteps=7, currentStep=3
  - When: progress 확인
  - Then: progress = Math.round((4/7)*100) = 57
  - Story: US-B03
  - Status: ⬜ Not Started

- **TC-CU-023**: canGoNext/canGoPrev 계산 검증
  - Given: currentStep=3, isAnimating=false, stepCompleted=true
  - When: canGoNext, canGoPrev 확인
  - Then: canGoNext=true, canGoPrev=true
  - Story: US-B03
  - Status: ⬜ Not Started

---

## 4. useRunStep Tests (`src/__tests__/useRunStep.test.ts`)

### runStep()

- **TC-CU-024**: 단계 실행 시 콜백 순서 검증
  - Given: demoSteps[0]에 3개 chatSequence
  - When: runStep(0) 호출
  - Then: onAnimatingChange(true) -> onChatReset -> onPhaseChange -> onChatMessage x3 -> onFileAdd -> onEditorContent -> onProgress -> onStepComplete 순서
  - Story: US-B03
  - Status: ⬜ Not Started

- **TC-CU-025**: 취소 메커니즘 검증
  - Given: runStep(0) 실행 중
  - When: runStep(1) 호출 (새 실행)
  - Then: 이전 실행이 중단되고 새 실행이 진행
  - Story: US-B03
  - Status: ⬜ Not Started

- **TC-CU-026**: 에러 발생 시 복구
  - Given: 콜백에서 에러 발생
  - When: runStep(0) 실행
  - Then: onAnimatingChange(false), onStepComplete 호출 (복구)
  - Story: US-B03
  - Status: ⬜ Not Started

---

## 5. DemoPage Integration Tests (`src/__tests__/DemoPage.test.tsx` 수정)

- **TC-CU-027**: 리팩토링 후 기존 테스트 호환성
  - Given: 기존 DemoPage.test.tsx의 모든 테스트
  - When: 리팩토링된 모듈로 교체
  - Then: 기존 테스트 로직이 동일하게 통과
  - Story: US-B04
  - Status: ⬜ Not Started

---

## 6. LogService Integration Tests

- **TC-CU-028**: StartPage에서 logStart 호출 확인
  - Given: StartPage 렌더링, 프로젝트 아이디어 입력
  - When: 시작 버튼 클릭
  - Then: logService.logStart가 fire-and-forget으로 호출됨
  - Story: US-I01
  - Status: ⬜ Not Started

- **TC-CU-029**: ResultPage에서 logComplete 호출 확인
  - Given: ResultPage 렌더링 (유효한 세션 데이터)
  - When: 페이지 마운트
  - Then: logService.logComplete가 fire-and-forget으로 호출됨
  - Story: US-I02
  - Status: ⬜ Not Started

- **TC-CU-030**: LogService 실패 시 데모 진행 무영향
  - Given: logService.logStart가 네트워크 에러 throw
  - When: StartPage에서 시작 버튼 클릭
  - Then: 에러 없이 데모 페이지로 정상 라우팅
  - Story: US-I01
  - Status: ⬜ Not Started

---

## 7. 삭제 검증 Tests

- **TC-CU-031**: 미사용 파일 삭제 후 빌드 성공
  - Given: stream/route.ts, estimate/route.ts, AIService.ts 삭제
  - When: npm run build 실행
  - Then: 빌드 성공
  - Story: US-I03
  - Status: ⬜ Not Started

---

## Requirements Coverage

| Requirement ID | Test Cases | Status |
|---------------|------------|--------|
| REQ-B02 | TC-CU-028~031 | ⬜ Pending |
| REQ-B03 | TC-CU-001~027 | ⬜ Pending |

## Story Coverage

| Story ID | Test Cases | Status |
|----------|------------|--------|
| US-B01 | TC-CU-001~009 | ⬜ Pending |
| US-B02 | TC-CU-010~015 | ⬜ Pending |
| US-B03 | TC-CU-016~026 | ⬜ Pending |
| US-B04 | TC-CU-027 | ⬜ Pending |
| US-I01 | TC-CU-028, 030 | ⬜ Pending |
| US-I02 | TC-CU-029 | ⬜ Pending |
| US-I03 | TC-CU-031 | ⬜ Pending |
