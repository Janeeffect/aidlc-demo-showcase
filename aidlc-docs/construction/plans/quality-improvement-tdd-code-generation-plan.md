# TDD Code Generation Plan - Unit 3: 품질 개선

## Unit Context
- **Project Type**: Brownfield (Next.js 14 + TypeScript)
- **Stories**: US-C01~C06 (접근성), US-E01~E05 (성능)
- **Test Location**: src/__tests__/

---

## Plan Step 0: 설정 및 의존성 설치
- [x] @next/bundle-analyzer devDependency 설치
- [x] next.config.js에 withBundleAnalyzer 조건부 래핑
- [x] package.json에 "analyze" script 추가
- [x] 기존 테스트 통과 확인

## Plan Step 1: 색상 대비 + 포커스 링 (US-C06)
- [x] globals.css 색상 대비 개선 - RED-GREEN-REFACTOR
  - [x] RED: TC-QI-010 (--kiro-text-muted #a0a0b8 확인) + TC-QI-011 (포커스 링 확인) 테스트 작성
  - [x] GREEN: globals.css 수정 (색상 변경 + :focus-visible 추가)
  - [x] REFACTOR: 불필요한 중복 제거
  - [x] VERIFY: 전체 테스트 통과

## Plan Step 2: ARIA 레이블 + 랜드마크 (US-C05, US-C04)
- [x] KiroIDELayout ARIA 속성 - RED-GREEN-REFACTOR
  - [x] RED: TC-QI-007 (aria-live) + TC-QI-008 (role="main") + TC-QI-009 (role="tree") 테스트 작성
  - [x] GREEN: KiroIDELayout.tsx에 role, aria-label, aria-live 추가
  - [x] REFACTOR: 정리
  - [x] VERIFY: 전체 테스트 통과

## Plan Step 3: 시작 페이지 접근성 (US-C01, US-C05)
- [x] 시작 페이지 키보드/ARIA - RED-GREEN-REFACTOR
  - [x] RED: TC-QI-001 (입력 aria-label) + TC-QI-002 (버튼 키보드 접근) 테스트 작성
  - [x] GREEN: page.tsx에 aria-label 추가
  - [x] REFACTOR: 정리
  - [x] VERIFY: 전체 테스트 통과

## Plan Step 4: 결과 페이지 탭 접근성 (US-C02)
- [x] 결과 페이지 탭 ARIA - RED-GREEN-REFACTOR
  - [x] RED: TC-QI-003~006 (tablist, tab, tabpanel, 키보드) 테스트 작성
  - [x] GREEN: result/page.tsx에 role, aria-selected, aria-controls, aria-labelledby 추가
  - [x] REFACTOR: 정리
  - [x] VERIFY: 전체 테스트 통과

## Plan Step 5: 이미지 최적화 (US-E01)
- [x] Next.js Image 컴포넌트 교체 - RED-GREEN-REFACTOR
  - [x] RED: TC-QI-017 (시작 페이지 Image) + TC-QI-018 (KiroIDELayout Image) 테스트 작성
  - [x] GREEN: page.tsx KiroLogo + KiroIDELayout KiroIcon을 next/image로 교체
  - [x] REFACTOR: 정리
  - [x] VERIFY: 전체 테스트 통과

## Plan Step 6: PhaseIndicator 메모이제이션 (US-E02)
- [x] PhaseIndicator 최적화 - RED-GREEN-REFACTOR
  - [x] RED: TC-QI-015 (React.memo) + TC-QI-016 (useMemo) 테스트 작성
  - [x] GREEN: PhaseIndicator에 useMemo + React.memo 적용
  - [x] REFACTOR: 정리
  - [x] VERIFY: 전체 테스트 통과

## Plan Step 7: MVPPreview 코드 스플리팅 (US-E03)
- [x] MVPPreview 산업별 분리 + lazy load - RED-GREEN-REFACTOR
  - [x] RED: TC-QI-012 (dynamic import) + TC-QI-013 (파일 분리) + TC-QI-014 (shimmer) 테스트 작성
  - [x] GREEN: 5개 산업별 파일 생성 + MVPPreview.tsx를 dynamic() import로 변경
  - [x] REFACTOR: 정리 (inline object literal로 SWC 호환성 수정)
  - [x] VERIFY: 전체 테스트 통과 (20 suites, 195 tests)

## Plan Step 8: Mermaid 로딩 UX (US-E04)
- [x] AWSArchitectureDiagram shimmer - RED-GREEN-REFACTOR
  - [x] RED: TC-QI-019 (shimmer 로딩) 테스트 작성
  - [x] GREEN: AWSArchitectureDiagram.tsx 로딩 UI를 shimmer로 변경
  - [x] REFACTOR: 정리
  - [x] VERIFY: 전체 테스트 통과 (20 suites, 197 tests)

## Plan Step 9: Bundle Analyzer 설정 확인 (US-E05)
- [x] TC-QI-020 (next.config.js 설정) 확인
  - [x] RED: TC-QI-020 테스트 작성
  - [x] GREEN: Step 0에서 이미 설정됨, 테스트 통과 확인
  - [x] VERIFY: 전체 테스트 통과 (20 suites, 197 tests)

## Plan Step 10: 최종 검증
- [x] 전체 테스트 실행 (기존 + 신규) - 20 suites, 197 tests PASSED
- [x] 빌드 확인 (npm run build) - SUCCESS
- [x] Code Summary 생성
