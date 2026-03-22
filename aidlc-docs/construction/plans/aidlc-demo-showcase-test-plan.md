# Test Plan - Unit 4: 신규 기능 (New Features)

## Unit Overview
- **Unit**: aidlc-demo-showcase (신규 기능)
- **Stories**: US-G01~G06, US-H01~H04, US-J01~J02
- **Requirements**: REQ-B08 (관리자 대시보드), REQ-B09 (다국어 지원)

---

## i18n System Tests

### useTranslation Hook
- **TC-NF-001**: 기본 locale이 'ko'이다
  - Given: localStorage에 언어 설정이 없을 때
  - When: useTranslation()을 호출하면
  - Then: locale이 'ko'이다
  - Story: US-G02

- **TC-NF-002**: dot notation 키로 한국어 번역을 반환한다
  - Given: locale이 'ko'일 때
  - When: t('start.inputLabel')을 호출하면
  - Then: "어떤 서비스를 만들고 싶으세요?"를 반환한다
  - Story: US-G03

- **TC-NF-003**: dot notation 키로 영어 번역을 반환한다
  - Given: locale이 'en'일 때
  - When: t('start.inputLabel')을 호출하면
  - Then: "What service would you like to build?"를 반환한다
  - Story: US-G03

- **TC-NF-004**: 존재하지 않는 키는 키 문자열을 반환한다
  - Given: 어떤 locale이든
  - When: t('nonexistent.key')를 호출하면
  - Then: "nonexistent.key"를 반환한다
  - Story: US-G03

- **TC-NF-005**: setLocale로 언어를 변경할 수 있다
  - Given: locale이 'ko'일 때
  - When: setLocale('en')을 호출하면
  - Then: locale이 'en'으로 변경된다
  - Story: US-G01

- **TC-NF-006**: 언어 변경 시 localStorage에 저장된다
  - Given: locale이 'ko'일 때
  - When: setLocale('en')을 호출하면
  - Then: localStorage 'aidlc-locale'에 'en'이 저장된다
  - Story: US-G02

### LanguageToggle Component
- **TC-NF-007**: 한국어 모드에서 "EN" 버튼을 표시한다
  - Given: locale이 'ko'일 때
  - When: LanguageToggle을 렌더링하면
  - Then: "EN" 텍스트가 표시된다
  - Story: US-G01

- **TC-NF-008**: 영어 모드에서 "KO" 버튼을 표시한다
  - Given: locale이 'en'일 때
  - When: LanguageToggle을 렌더링하면
  - Then: "KO" 텍스트가 표시된다
  - Story: US-G01

- **TC-NF-009**: 클릭 시 언어가 전환된다
  - Given: locale이 'ko'일 때
  - When: LanguageToggle 버튼을 클릭하면
  - Then: setLocale('en')이 호출된다
  - Story: US-G01

### Translation Coverage
- **TC-NF-010**: 한국어 번역 맵에 모든 필수 키가 존재한다
  - Given: ko.ts 번역 맵
  - When: 필수 키 목록을 검증하면
  - Then: common, start, demo, result, admin 네임스페이스의 모든 키가 존재한다
  - Story: US-G03~G06

- **TC-NF-011**: 영어 번역 맵에 모든 필수 키가 존재한다
  - Given: en.ts 번역 맵
  - When: 필수 키 목록을 검증하면
  - Then: ko.ts와 동일한 키 구조를 가진다
  - Story: US-G03~G06

---

## Admin Dashboard Tests

### Admin Authentication
- **TC-NF-012**: 미인증 시 비밀번호 입력 화면을 표시한다
  - Given: sessionStorage에 인증 정보가 없을 때
  - When: AdminPage를 렌더링하면
  - Then: 비밀번호 입력 필드와 확인 버튼이 표시된다
  - Story: US-H01

- **TC-NF-013**: 올바른 비밀번호로 인증에 성공한다
  - Given: 비밀번호 입력 화면에서
  - When: 올바른 비밀번호를 입력하고 확인을 클릭하면
  - Then: 대시보드가 표시된다
  - Story: US-H01

- **TC-NF-014**: 잘못된 비밀번호로 에러 메시지를 표시한다
  - Given: 비밀번호 입력 화면에서
  - When: 잘못된 비밀번호를 입력하고 확인을 클릭하면
  - Then: 에러 메시지가 표시된다
  - Story: US-H01

### Admin Statistics
- **TC-NF-015**: 통계 카드 4개를 표시한다
  - Given: 인증된 상태에서 통계 데이터가 로드되었을 때
  - When: 대시보드를 렌더링하면
  - Then: 총 세션, 완료 세션, 완료율, 평균 시간 카드가 표시된다
  - Story: US-H01

- **TC-NF-016**: 최근 세션 테이블을 표시한다
  - Given: 인증된 상태에서 recentLogs가 있을 때
  - When: 대시보드를 렌더링하면
  - Then: 타임스탬프, 프로젝트 아이디어, 상태, 소요 시간 컬럼이 표시된다
  - Story: US-H02

- **TC-NF-017**: 데이터가 없을 때 빈 상태 메시지를 표시한다
  - Given: 인증된 상태에서 로그가 0개일 때
  - When: 대시보드를 렌더링하면
  - Then: "데이터가 없습니다" 메시지가 표시된다
  - Story: US-H01

### API Statistics Calculation
- **TC-NF-018**: 산업별 분포를 올바르게 계산한다
  - Given: 다양한 industry를 가진 로그 배열
  - When: calculateIndustryDistribution()을 호출하면
  - Then: 산업별 count와 percentage가 올바르게 계산된다
  - Story: US-H04

- **TC-NF-019**: 세션 추이를 시간대별로 올바르게 계산한다
  - Given: 다양한 timestamp를 가진 로그 배열
  - When: calculateSessionTrend()를 호출하면
  - Then: 시간대별 count가 올바르게 계산된다
  - Story: US-J01

- **TC-NF-020**: 인기 아이디어를 상위 5개로 추출한다
  - Given: 중복 projectIdea를 가진 로그 배열
  - When: extractPopularIdeas()를 호출하면
  - Then: count 내림차순 상위 5개가 반환된다
  - Story: US-H03

- **TC-NF-021**: industry 없는 로그는 "기타"로 분류한다
  - Given: industry 필드가 없는 로그가 포함된 배열
  - When: calculateIndustryDistribution()을 호출하면
  - Then: 해당 로그는 "기타" 카테고리로 집계된다
  - Story: US-H04

- **TC-NF-022**: 빈 로그 배열에서 빈 결과를 반환한다
  - Given: 빈 로그 배열
  - When: 각 집계 함수를 호출하면
  - Then: 빈 배열을 반환한다
  - Story: US-H01

### LogService Extension
- **TC-NF-023**: logStart에 industry를 전달할 수 있다
  - Given: LogService 인스턴스
  - When: logStart(sessionId, idea, "이커머스 플랫폼")을 호출하면
  - Then: POST 요청 body에 industry 필드가 포함된다
  - Story: US-H04

### Admin i18n
- **TC-NF-024**: 관리자 대시보드가 다국어를 지원한다
  - Given: locale이 'en'일 때
  - When: AdminPage를 렌더링하면
  - Then: 레이블과 제목이 영어로 표시된다
  - Story: US-J02

---

## Requirements Coverage

| Requirement | Test Cases | Status |
|-------------|------------|--------|
| REQ-B08 (관리자 대시보드) | TC-NF-012~022, TC-NF-024 | Pending |
| REQ-B09 (다국어 지원) | TC-NF-001~011, TC-NF-024 | Pending |
