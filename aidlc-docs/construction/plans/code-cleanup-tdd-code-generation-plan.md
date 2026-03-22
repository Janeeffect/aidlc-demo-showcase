# TDD Code Generation Plan - Unit 1: 코드 정리

## Unit Context
- **Workspace Root**: C:\Users\jhyojin\Downloads\aidlc-workshop\aidlc-workshop
- **Project Type**: Brownfield (Next.js 14 모놀리식)
- **Stories**: US-B01, US-B02, US-B03, US-B04, US-I01, US-I02, US-I03
- **Requirements**: REQ-B02, REQ-B03
- **Test Framework**: Jest 30 + @testing-library/react 16
- **Test Convention**: src/__tests__/*.test.ts(x)

---

## Plan Step 0: Contract Skeleton + 타입 확장 + 데이터 파일
- [x] 0.1: src/types/demo.ts에 ChatMessage, DemoStep 인터페이스 추가
- [x] 0.2: src/data/scenarios.ts 생성 (ScenarioDefinition 타입 + SCENARIOS 데이터 + DEFAULT_SCENARIO)
- [x] 0.3: src/utils/scenarioDetector.ts skeleton 생성 (detectScenario, calculateMatchScore - throw NotImplementedError)
- [x] 0.4: src/utils/demoStepGenerator.ts skeleton 생성 (generateDemoSteps - throw NotImplementedError)
- [x] 0.5: src/hooks/useDemoProgress.ts skeleton 생성 (useDemoProgress - throw NotImplementedError)
- [x] 0.6: src/hooks/useRunStep.ts skeleton 생성 (useRunStep - throw NotImplementedError)
- [x] 0.7: 컴파일 확인 (getDiagnostics) - PASSED

---

## Plan Step 1: ScenarioDetector (TDD) - US-B01

### 1.1 calculateMatchScore()
- [x] RED: TC-CU-006 (우선 키워드 가중치 1.5) 테스트 작성 -> 실패 확인
- [x] GREEN: calculateMatchScore 최소 구현 -> 통과 확인
- [x] RED: TC-CU-007 (일반 키워드 가중치 1.0) 테스트 추가 -> 통과 확인
- [x] GREEN: 구현 보완 -> 통과 확인
- [x] RED: TC-CU-008 (복수 키워드 점수 합산) 테스트 추가 -> 통과 확인
- [x] GREEN: 구현 보완 -> 통과 확인
- [x] RED: TC-CU-009 (매칭 없으면 0) 테스트 추가 -> 통과 확인
- [x] GREEN: 구현 보완 -> 통과 확인
- [x] REFACTOR: calculateMatchScore 코드 정리
- [x] VERIFY: TC-CU-006~009 전체 통과

### 1.2 detectScenario()
- [x] RED: TC-CU-001 (이커머스 매칭) 테스트 작성 -> 실패 확인
- [x] GREEN: detectScenario 최소 구현 -> 통과 확인
- [x] RED: TC-CU-002 (핀테크 매칭) 테스트 추가 -> 통과 확인
- [x] GREEN: 구현 보완 -> 통과 확인
- [x] RED: TC-CU-003 (헬스케어 매칭) 테스트 추가 -> 통과 확인
- [x] GREEN: 구현 보완 -> 통과 확인
- [x] RED: TC-CU-004 (기본 시나리오 폴백) 테스트 추가 -> 통과 확인
- [x] GREEN: 구현 보완 -> 통과 확인
- [x] RED: TC-CU-005 (빈 문자열) 테스트 추가 -> 통과 확인
- [x] GREEN: 구현 보완 -> 통과 확인
- [x] REFACTOR: detectScenario 코드 정리
- [x] VERIFY: TC-CU-001~009 전체 통과

---

## Plan Step 2: DemoStepGenerator (TDD) - US-B02

### 2.1 generateDemoSteps()
- [x] RED: TC-CU-010 (7개 단계 생성) 테스트 작성 -> 실패 확인
- [x] GREEN: generateDemoSteps 최소 구현 -> 통과 확인
- [x] RED: TC-CU-011 (Phase 순서) 테스트 추가 -> 통과 확인
- [x] GREEN: 구현 보완 -> 통과 확인
- [x] RED: TC-CU-012 (파일명 고유성) 테스트 추가 -> 통과 확인
- [x] GREEN: 구현 보완 -> 통과 확인
- [x] RED: TC-CU-013 (메시지 ID 고유성) 테스트 추가 -> 통과 확인
- [x] GREEN: 구현 보완 -> 통과 확인
- [x] RED: TC-CU-014 (시나리오 데이터 반영) 테스트 추가 -> 통과 확인
- [x] GREEN: 구현 보완 -> 통과 확인
- [x] RED: TC-CU-015 (빈 입력) 테스트 추가 -> 통과 확인
- [x] GREEN: 구현 보완 -> 통과 확인
- [x] REFACTOR: generateDemoSteps 코드 정리
- [x] VERIFY: TC-CU-010~015 전체 통과

---

## Plan Step 3: useDemoProgress Hook (TDD) - US-B03

### 3.1 초기 상태 + handleNextStep + handlePrevStep
- [x] RED: TC-CU-016 (초기 상태) 테스트 작성 -> 실패 확인
- [x] GREEN: useDemoProgress 최소 구현 -> 통과 확인
- [x] RED: TC-CU-017 (다음 단계 이동) 테스트 추가 -> 통과 확인
- [x] GREEN: handleNextStep 구현 -> 통과 확인
- [x] RED: TC-CU-018 (애니메이션 중 차단) 테스트 추가 -> 통과 확인
- [x] GREEN: guard 조건 추가 -> 통과 확인
- [x] RED: TC-CU-019 (마지막 단계 onComplete) 테스트 추가 -> 통과 확인
- [x] GREEN: onComplete 콜백 로직 -> 통과 확인
- [x] RED: TC-CU-020 (이전 단계 이동) 테스트 추가 -> 통과 확인
- [x] GREEN: handlePrevStep 구현 -> 통과 확인
- [x] RED: TC-CU-021 (첫 단계 이전 차단) 테스트 추가 -> 통과 확인
- [x] GREEN: guard 조건 추가 -> 통과 확인
- [x] RED: TC-CU-022 (progress 계산) 테스트 추가 -> 통과 확인
- [x] GREEN: progress 계산 로직 -> 통과 확인
- [x] RED: TC-CU-023 (canGoNext/canGoPrev) 테스트 추가 -> 통과 확인
- [x] GREEN: derived 값 계산 -> 통과 확인
- [x] REFACTOR: useDemoProgress 코드 정리
- [x] VERIFY: TC-CU-016~023 전체 통과

---

## Plan Step 4: useRunStep Hook (TDD) - US-B03

### 4.1 runStep + 취소 + 에러 복구
- [x] RED: TC-CU-024 (콜백 순서) 테스트 작성 -> 실패 확인
- [x] GREEN: useRunStep 최소 구현 -> 통과 확인
- [x] RED: TC-CU-025 (취소 메커니즘) 테스트 추가 -> 통과 확인
- [x] GREEN: runIdRef 취소 로직 -> 통과 확인
- [x] RED: TC-CU-026 (에러 복구) 테스트 추가 -> 통과 확인
- [x] GREEN: try-catch 복구 로직 -> 통과 확인
- [x] REFACTOR: useRunStep 코드 정리
- [x] VERIFY: TC-CU-024~026 전체 통과

---

## Plan Step 5: DemoPage 리팩토링 - US-B04
- [x] 5.1: DemoPage.tsx 리팩토링 (외부 모듈 import + 조합만 담당, 138 라인)
- [x] 5.2: TC-CU-027 - 기존 DemoPage.test.tsx를 새 모듈 기반으로 업데이트
- [x] 5.3: 기존 테스트 전체 실행 -> 12 suites, 157 tests PASSED
- [x] VERIFY: DemoPage 라인 수 138 (200 이하 확인)

---

## Plan Step 6: LogService 연동 - US-I01, US-I02
- [x] 6.1: RED: TC-CU-028 (StartPage logStart 호출) 테스트 작성 -> 실패 확인
- [x] 6.2: GREEN: StartPage에 fire-and-forget logStart 추가 -> 통과 확인
- [x] 6.3: RED: TC-CU-029 (ResultPage logComplete 호출) 테스트 작성 -> 실패 확인
- [x] 6.4: GREEN: ResultPage에 fire-and-forget logComplete 추가 -> 통과 확인
- [x] 6.5: RED: TC-CU-030 (LogService 실패 무영향) 테스트 작성 -> 실패 확인
- [x] 6.6: GREEN: catch 무시 패턴 확인 -> 통과 확인
- [x] VERIFY: TC-CU-028~030 전체 통과, 13 suites 160 tests PASSED

---

## Plan Step 7: 미사용 코드 삭제 - US-I03
- [x] 7.1: src/app/api/demo/stream/route.ts 삭제
- [x] 7.2: src/app/api/demo/estimate/route.ts 삭제
- [x] 7.3: src/services/AIService.ts 삭제
- [x] 7.4: TC-CU-031 - npm run build 성공 확인
- [x] 7.5: 기존 테스트 전체 실행 -> 13 suites, 160 tests PASSED
- [x] VERIFY: 삭제 후 빌드 + 테스트 통과

---

## Plan Step 8: Code Summary 문서 생성
- [x] 8.1: aidlc-docs/construction/aidlc-demo-showcase/code/code-summary.md 생성
- [x] 8.2: 생성/수정/삭제 파일 목록, 테스트 결과 요약

---

## Story Completion Tracking

| Story ID | Plan Steps | Status |
|----------|-----------|--------|
| US-B01 | Step 1 (ScenarioDetector) | DONE |
| US-B02 | Step 2 (DemoStepGenerator) | DONE |
| US-B03 | Step 3, 4 (Hooks) | DONE |
| US-B04 | Step 5 (DemoPage 리팩토링) | DONE |
| US-I01 | Step 6 (StartPage log) | DONE |
| US-I02 | Step 6 (ResultPage log) | DONE |
| US-I03 | Step 7 (삭제) | DONE |
