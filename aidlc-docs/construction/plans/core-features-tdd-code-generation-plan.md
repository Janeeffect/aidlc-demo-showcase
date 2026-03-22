# TDD Code Generation Plan - Unit 2: 핵심 기능

## Unit Context
- **Workspace Root**: C:\Users\jhyojin\Downloads\aidlc-workshop\aidlc-workshop
- **Project Type**: Brownfield (Next.js 14 모놀리식)
- **Stories**: US-A01~A07, US-D01, US-D02
- **Requirements**: REQ-B01, REQ-B06
- **Test Framework**: Jest 30 + @testing-library/react 16
- **Test Convention**: src/__tests__/*.test.ts(x)

---

## Plan Step 0: 타입 확장 + Animation Target 상수
- [x] 0.1: src/types/demo.ts에 DemoStep.animationSequence 필드 추가
- [x] 0.2: src/types/animation.ts에 ANIMATION_TARGETS, FALLBACK_POSITIONS, resolveTargetPosition 추가
- [x] 0.3: src/types/api.ts에 ApiErrorResponse 타입 추가
- [x] 0.4: 컴파일 확인 (getDiagnostics) - PASSED, 13 suites 160 tests PASSED

---

## Plan Step 1: AnimationSequence 생성 (TDD) - US-A01~A07
- [x] 1.1: RED: TC-CF-001 (모든 DemoStep에 animationSequence 존재) 테스트 작성 -> 실패 확인
- [x] 1.2: GREEN: demoStepGenerator에 buildAnimationSequence 추가 -> 통과 확인
- [x] 1.3: RED: TC-CF-002 (move step 포함) 테스트 추가 -> 통과 확인
- [x] 1.4: RED: TC-CF-003 (click step 포함) 테스트 추가 -> 통과 확인
- [x] 1.5: RED: TC-CF-004 (type step 포함) 테스트 추가 -> 통과 확인
- [x] 1.6: RED: TC-CF-005 (scroll step 포함) 테스트 추가 -> 통과 확인
- [x] 1.7: RED: TC-CF-006 (step ID 고유성) 테스트 추가 -> 통과 확인
- [x] 1.8: RED: TC-CF-007 (duration >= 100ms) 테스트 추가 -> 통과 확인
- [x] 1.9: REFACTOR: buildAnimationSequence 코드 정리
- [x] VERIFY: TC-CF-001~007 전체 통과

---

## Plan Step 2: resolveTargetPosition (TDD) - US-A01
- [x] 2.1: RED: TC-CF-008 (DOM 없으면 fallback) 테스트 작성 -> 실패 확인
- [x] 2.2: GREEN: resolveTargetPosition 구현 -> 통과 확인
- [x] 2.3: RED: TC-CF-009 (알 수 없는 target 기본 fallback) 테스트 추가 -> 통과 확인
- [x] 2.4: GREEN: 기본 fallback 로직 추가 -> 통과 확인
- [x] VERIFY: TC-CF-008~009 전체 통과

---

## Plan Step 3: API 에러 응답 통일 (TDD) - US-D02
- [x] 3.1: RED: TC-CF-010 (/api/demo/start 에러 형식) 테스트 작성 -> 실패 확인
- [x] 3.2: GREEN: start route 에러 응답 수정 -> 통과 확인
- [x] 3.3: RED: TC-CF-011 (/api/demo/send-report 에러 형식) 테스트 작성 -> 실패 확인
- [x] 3.4: GREEN: send-report route 에러 응답 수정 -> 통과 확인
- [x] 3.5: RED: TC-CF-012 (/api/log 에러 형식) 테스트 작성 -> 실패 확인
- [x] 3.6: GREEN: log route 에러 응답 수정 -> 통과 확인
- [x] VERIFY: TC-CF-010~012 전체 통과

---

## Plan Step 4: 이메일 에러 피드백 (TDD) - US-D01
- [x] 4.1: RED: TC-CF-013 (전송 실패 에러 메시지) 테스트 작성 -> 실패 확인
- [x] 4.2: GREEN: EmailReportModal에 errorMessage state 추가 -> 통과 확인
- [x] 4.3: RED: TC-CF-014 (재시도 시 에러 사라짐) 테스트 작성 -> 실패 확인
- [x] 4.4: GREEN: 재시도 로직 구현 -> 통과 확인
- [x] VERIFY: TC-CF-013~014 전체 통과

---

## Plan Step 5: KiroIDELayout data-attribute 추가 (TDD) - US-A02, A03
- [x] 5.1: RED: TC-CF-015 (data-animation-target 존재) 테스트 작성 -> 실패 확인
- [x] 5.2: GREEN: KiroIDELayout에 data-animation-target 속성 추가 -> 통과 확인
- [x] VERIFY: TC-CF-015 통과

---

## Plan Step 6: DemoPage Animation 통합 - US-A01, A07
- [x] 6.1: RED: TC-CF-016 (AnimationOrchestrator 렌더링) 테스트 작성 -> 실패 확인
- [x] 6.2: GREEN: DemoPage에 AnimationOrchestrator 추가 -> 통과 확인
- [x] 6.3: AnimationOrchestrator에 resolveTargetPosition 통합
- [x] VERIFY: TC-CF-016 통과 + 기존 테스트 전체 통과

---

## Plan Step 7: 전체 검증 + Code Summary
- [x] 7.1: 전체 테스트 실행 -> 18 suites, 177 tests PASSED
- [x] 7.2: npm run build 성공 확인
- [x] 7.3: aidlc-docs/construction/core-features/code/code-summary.md 생성

---

## Story Completion Tracking

| Story ID | Plan Steps | Status |
|----------|-----------|--------|
| US-A01 | Step 1, 2, 6 | Completed |
| US-A02 | Step 1, 5 | Completed |
| US-A03 | Step 1, 5 | Completed |
| US-A04 | Step 1 | Completed |
| US-A05 | Step 1 | Completed |
| US-A06 | Step 1 | Completed |
| US-A07 | Step 1, 6 | Completed |
| US-D01 | Step 4 | Completed |
| US-D02 | Step 3 | Completed |
