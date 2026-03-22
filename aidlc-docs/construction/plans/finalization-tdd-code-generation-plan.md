# TDD Code Generation Plan for Unit 5: 마무리 (Finalization)

## Unit Context
- **Workspace Root**: C:\Users\jhyojin\Downloads\aidlc-workshop\aidlc-workshop
- **Project Type**: Brownfield (Next.js 14 + TypeScript)
- **Stories**: US-F01 (이메일 리포트 모의 구현 유지)
- **Requirements**: REQ-B05

## 수정 대상 파일
- `src/app/result/page.tsx` - EstimateTab, AIDLCOutputsTab, KiroIntroTab, EmailReportModal, translateRole, translateSeniority
- `src/i18n/ko.ts` - 추가 번역 키
- `src/i18n/en.ts` - 추가 번역 키

## 신규 테스트 파일
- `src/__tests__/ResultI18n.test.tsx`

---

### Plan Step 0: 번역 키 추가 및 Contract Skeleton 준비
- [x] ko.ts에 result.estimate.roles, result.estimate.seniority, result.kiro 세부 키, result.email placeholder 키 추가
- [x] en.ts에 동일 구조 영어 키 추가
- [x] 빌드 확인 (기존 테스트 깨지지 않음)

### Plan Step 1: EstimateTab 다국어 적용 (TDD)

- [x] 1.1 EstimateTab 한국어 렌더링 - RED-GREEN-REFACTOR
  - [x] RED: TC-FIN-001 실패하는 테스트 작성 (EstimateTab이 t() 키를 사용하는지 검증)
  - [x] GREEN: EstimateTab에 useTranslation() 추가, 하드코딩 텍스트를 t() 호출로 교체
  - [x] REFACTOR: 코드 정리
  - [x] VERIFY: 테스트 통과 확인
  - Story: US-F01

- [x] 1.2 EstimateTab 영어 렌더링 - RED-GREEN-REFACTOR
  - [x] RED: TC-FIN-002 실패하는 테스트 작성
  - [x] GREEN: 영어 locale에서도 정상 렌더링 확인 (이미 1.1에서 t() 적용됨)
  - [x] REFACTOR: 불필요한 코드 제거
  - [x] VERIFY: 테스트 통과 확인
  - Story: US-F01

- [x] 1.3 translateRole locale 분기 - RED-GREEN-REFACTOR
  - [x] RED: TC-FIN-003 실패하는 테스트 작성
  - [x] GREEN: translateRole 함수에 locale 파라미터 추가, 분기 로직 구현
  - [x] REFACTOR: 코드 정리
  - [x] VERIFY: 테스트 통과 확인
  - Story: US-F01

- [x] 1.4 translateSeniority locale 분기 - RED-GREEN-REFACTOR
  - [x] RED: TC-FIN-004 실패하는 테스트 작성
  - [x] GREEN: translateSeniority 함수에 locale 파라미터 추가, 분기 로직 구현
  - [x] REFACTOR: 코드 정리
  - [x] VERIFY: 테스트 통과 확인
  - Story: US-F01

### Plan Step 2: AIDLCOutputsTab 다국어 적용 (TDD)

- [x] 2.1 AIDLCOutputsTab 다국어 - RED-GREEN-REFACTOR
  - [x] RED: TC-FIN-005 실패하는 테스트 작성
  - [x] GREEN: AIDLCOutputsTab에 useTranslation() 추가, 제목/설명을 t() 호출로 교체
  - [x] REFACTOR: 코드 정리
  - [x] VERIFY: 테스트 통과 확인
  - Story: US-F01

### Plan Step 3: KiroIntroTab 다국어 적용 (TDD)

- [x] 3.1 KiroIntroTab 한국어 렌더링 - RED-GREEN-REFACTOR
  - [x] RED: TC-FIN-006 실패하는 테스트 작성
  - [x] GREEN: KiroIntroTab에 useTranslation() 추가, 하드코딩 텍스트를 t() 호출로 교체
  - [x] REFACTOR: 코드 정리
  - [x] VERIFY: 테스트 통과 확인
  - Story: US-F01

- [x] 3.2 KiroIntroTab 영어 렌더링 - RED-GREEN-REFACTOR
  - [x] RED: TC-FIN-007 실패하는 테스트 작성
  - [x] GREEN: 영어 locale에서 정상 렌더링 확인
  - [x] REFACTOR: 코드 정리
  - [x] VERIFY: 테스트 통과 확인
  - Story: US-F01

### Plan Step 4: EmailReportModal 다국어 적용 (TDD)

- [x] 4.1 EmailReportModal 폼 레이블 다국어 - RED-GREEN-REFACTOR
  - [x] RED: TC-FIN-008 실패하는 테스트 작성
  - [x] GREEN: EmailReportModal에 useTranslation() 추가, 폼 레이블/버튼을 t() 호출로 교체
  - [x] REFACTOR: 코드 정리
  - [x] VERIFY: 테스트 통과 확인
  - Story: US-F01

- [x] 4.2 EmailReportModal 성공 메시지 이메일 치환 - RED-GREEN-REFACTOR
  - [x] RED: TC-FIN-009 실패하는 테스트 작성
  - [x] GREEN: 성공 메시지에서 {email} placeholder를 실제 이메일로 치환
  - [x] REFACTOR: 코드 정리
  - [x] VERIFY: 테스트 통과 확인
  - Story: US-F01

### Plan Step 5: 번역 키 커버리지 검증 (TDD)

- [x] 5.1 result.estimate.* 키 커버리지 - RED-GREEN-REFACTOR
  - [x] RED: TC-FIN-010 실패하는 테스트 작성
  - [x] GREEN: 누락된 키가 있으면 ko.ts/en.ts에 추가
  - [x] REFACTOR: 키 정리
  - [x] VERIFY: 테스트 통과 확인
  - Story: US-F01

- [x] 5.2 result.kiro.* 키 커버리지 - RED-GREEN-REFACTOR
  - [x] RED: TC-FIN-011 실패하는 테스트 작성
  - [x] GREEN: 누락된 키가 있으면 추가
  - [x] REFACTOR: 키 정리
  - [x] VERIFY: 테스트 통과 확인
  - Story: US-F01

- [x] 5.3 result.email.* 키 커버리지 - RED-GREEN-REFACTOR
  - [x] RED: TC-FIN-012 실패하는 테스트 작성
  - [x] GREEN: 누락된 키가 있으면 추가
  - [x] REFACTOR: 키 정리
  - [x] VERIFY: 테스트 통과 확인
  - Story: US-F01

### Plan Step 6: 전체 검증 및 마무리
- [x] 기존 28 suites + 신규 테스트 전체 실행 -> ALL PASS (29 suites, 240 tests)
- [x] next build 성공 확인 (10/10 static pages)
- [x] Code Summary 생성 (`aidlc-docs/construction/finalization/code/code-summary.md`)
- [x] aidlc-state.md Unit 5 Code Generation COMPLETED 업데이트
