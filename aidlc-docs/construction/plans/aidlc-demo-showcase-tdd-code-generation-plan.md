# TDD Code Generation Plan - Unit 4: 신규 기능 (New Features)

## Unit Context
- **Project Type**: Brownfield (Next.js 14 + TypeScript)
- **Stories**: US-G01~G06, US-H01~H04, US-J01~J02
- **Test Framework**: Jest + React Testing Library
- **이전 테스트 현황**: 20 suites, 197 tests PASSED

---

### Step 0: Type 확장 및 Contract Skeleton 생성
- [x] DemoLog에 industry? 필드 추가 (src/types/demo.ts)
- [x] LogRequest에 industry? 필드 추가 (src/types/api.ts)
- [x] IndustryDistribution, SessionTrend, PopularIdea 타입 추가 (src/types/api.ts)
- [x] src/i18n/ko.ts skeleton 생성 (빈 번역 맵)
- [x] src/i18n/en.ts skeleton 생성 (빈 번역 맵)
- [x] src/i18n/index.ts skeleton 생성 (useTranslation stub)
- [x] src/contexts/LanguageContext.tsx skeleton 생성 (LanguageProvider stub)
- [x] src/components/ui/LanguageToggle.tsx skeleton 생성
- [x] src/app/admin/page.tsx skeleton 생성
- [x] 기존 197 테스트 통과 확인

### Step 1: useTranslation Hook - RED-GREEN-REFACTOR
- [x] RED: TC-NF-001 (기본 locale 'ko') 테스트 작성 -> FAIL
- [x] GREEN: LanguageContext + useTranslation 최소 구현 -> PASS
- [x] RED: TC-NF-002 (한국어 번역 반환) 테스트 작성 -> FAIL
- [x] GREEN: t() 함수 dot notation 조회 구현 + ko.ts 번역 데이터 -> PASS
- [x] RED: TC-NF-003 (영어 번역 반환) 테스트 작성 -> FAIL
- [x] GREEN: en.ts 번역 데이터 + locale 전환 로직 -> PASS
- [x] RED: TC-NF-004 (존재하지 않는 키 fallback) 테스트 작성 -> FAIL
- [x] GREEN: fallback 로직 구현 -> PASS
- [x] RED: TC-NF-005 (setLocale 언어 변경) 테스트 작성 -> FAIL
- [x] GREEN: setLocale 구현 -> PASS
- [x] RED: TC-NF-006 (localStorage 저장) 테스트 작성 -> FAIL
- [x] GREEN: localStorage 연동 구현 -> PASS
- [x] REFACTOR: useTranslation 코드 정리
- [x] VERIFY: TC-NF-001~006 전체 PASS

### Step 2: LanguageToggle Component - RED-GREEN-REFACTOR
- [x] RED: TC-NF-007 (한국어 모드 "EN" 표시) 테스트 작성 -> FAIL
- [x] GREEN: LanguageToggle 최소 구현 -> PASS
- [x] RED: TC-NF-008 (영어 모드 "KO" 표시) 테스트 작성 -> FAIL
- [x] GREEN: locale 기반 조건부 렌더링 -> PASS
- [x] RED: TC-NF-009 (클릭 시 언어 전환) 테스트 작성 -> FAIL
- [x] GREEN: onClick 핸들러 구현 -> PASS
- [x] REFACTOR: LanguageToggle 스타일 정리
- [x] VERIFY: TC-NF-007~009 전체 PASS

### Step 3: Translation Coverage - RED-GREEN-REFACTOR
- [x] RED: TC-NF-010 (한국어 필수 키 존재) 테스트 작성 -> FAIL
- [x] GREEN: ko.ts 전체 번역 데이터 완성 -> PASS
- [x] RED: TC-NF-011 (영어 필수 키 존재) 테스트 작성 -> FAIL
- [x] GREEN: en.ts 전체 번역 데이터 완성 -> PASS
- [x] VERIFY: TC-NF-010~011 전체 PASS

### Step 4: Admin Authentication - RED-GREEN-REFACTOR
- [x] RED: TC-NF-012 (미인증 시 비밀번호 화면) 테스트 작성 -> FAIL
- [x] GREEN: AdminPage 인증 화면 구현 -> PASS
- [x] RED: TC-NF-013 (올바른 비밀번호 인증 성공) 테스트 작성 -> FAIL
- [x] GREEN: verifyPassword + 인증 상태 전환 구현 -> PASS
- [x] RED: TC-NF-014 (잘못된 비밀번호 에러) 테스트 작성 -> FAIL
- [x] GREEN: 에러 메시지 표시 구현 -> PASS
- [x] REFACTOR: 인증 로직 정리
- [x] VERIFY: TC-NF-012~014 전체 PASS (24 suites, 211 tests)

### Step 5: Admin Statistics Display - RED-GREEN-REFACTOR
- [x] RED: TC-NF-015 (통계 카드 4개 표시) 테스트 작성 -> FAIL
- [x] GREEN: AdminPage 대시보드 UI + fetch 구현 -> PASS
- [x] RED: TC-NF-016 (최근 세션 테이블) 테스트 작성 -> FAIL
- [x] GREEN: 세션 테이블 렌더링 구현 -> PASS
- [x] RED: TC-NF-017 (빈 상태 메시지) 테스트 작성 -> FAIL
- [x] GREEN: 빈 데이터 조건부 렌더링 -> PASS
- [x] REFACTOR: AdminPage UI 정리
- [x] VERIFY: TC-NF-015~017 전체 PASS (25 suites, 214 tests)

### Step 6: API Statistics Calculation - RED-GREEN-REFACTOR
- [x] RED: TC-NF-018 (산업별 분포 계산) 테스트 작성 -> FAIL
- [x] GREEN: calculateIndustryDistribution 구현 -> PASS
- [x] RED: TC-NF-019 (세션 추이 계산) 테스트 작성 -> FAIL
- [x] GREEN: calculateSessionTrend 구현 -> PASS
- [x] RED: TC-NF-020 (인기 아이디어 상위 5개) 테스트 작성 -> FAIL
- [x] GREEN: extractPopularIdeas 구현 -> PASS
- [x] RED: TC-NF-021 (industry 없는 로그 "기타" 분류) 테스트 작성 -> FAIL
- [x] GREEN: fallback 로직 구현 -> PASS
- [x] RED: TC-NF-022 (빈 배열 빈 결과) 테스트 작성 -> FAIL
- [x] GREEN: 빈 배열 처리 -> PASS
- [x] REFACTOR: /api/log GET에 집계 함수 통합
- [x] VERIFY: TC-NF-018~022 전체 PASS

### Step 7: LogService Extension - RED-GREEN-REFACTOR
- [x] RED: TC-NF-023 (logStart industry 전달) 테스트 작성 -> FAIL
- [x] GREEN: LogService.logStart 시그니처 확장 -> PASS
- [x] VERIFY: TC-NF-023 PASS + 기존 LogService 테스트 PASS

### Step 8: Admin i18n - RED-GREEN-REFACTOR
- [x] RED: TC-NF-024 (대시보드 영어 표시) 테스트 작성 -> FAIL
- [x] GREEN: AdminPage에 useTranslation 적용 -> PASS
- [x] VERIFY: TC-NF-024 PASS

### Step 9: 기존 페이지 다국어 적용
- [x] layout.tsx에 LanguageProvider 래핑
- [x] StartPage에 useTranslation + LanguageToggle 적용
- [x] DemoPage에 useTranslation + LanguageToggle 적용
- [x] ResultPage에 useTranslation + LanguageToggle 적용
- [x] ResultSummary에 useTranslation 적용 (이미 번역 키 사용 가능)
- [x] StartPage logStart에 industry 전달
- [x] VERIFY: 기존 테스트 + 신규 테스트 전체 PASS

### Step 10: 최종 검증
- [x] 전체 테스트 실행 (jest --verbose) - 28 suites, 221 tests ALL PASSED
- [x] next build 성공 확인 - 10/10 static pages, SUCCESS
- [x] Code Summary 생성 (aidlc-docs/construction/aidlc-demo-showcase/code/code-summary.md)
- [x] Plan 체크박스 최종 업데이트
- [x] aidlc-state.md Unit 4 COMPLETED 업데이트
