# Business Rules - Unit 4: 신규 기능 (New Features)

## BR-NF-01: 언어 전환 규칙

- 지원 언어는 한국어(ko)와 영어(en) 2개이다
- 기본 언어는 한국어(ko)이다
- 언어 전환 시 페이지 새로고침 없이 즉시 UI가 변경된다
- 언어 전환은 React Context를 통해 전파된다

## BR-NF-02: 언어 영속화 규칙

- 선택한 언어는 localStorage의 `aidlc-locale` 키에 저장한다
- 앱 초기 로드 시 localStorage에서 언어 설정을 읽는다
- localStorage에 값이 없으면 기본값 'ko'를 사용한다
- localStorage 접근 실패 시 (SSR, 비활성화 등) 기본값 'ko'를 사용한다

## BR-NF-03: 번역 키 조회 규칙

- `t('start.title')` 형태의 dot notation으로 중첩 키를 조회한다
- 키가 존재하지 않으면 키 문자열 자체를 반환한다 (fallback)
- 빈 문자열 키는 빈 문자열을 반환한다
- 번역 값이 문자열이 아닌 경우 키 문자열을 반환한다

## BR-NF-04: 번역 대상 범위 규칙

- UI 텍스트 (버튼, 레이블, 안내 메시지, 탭명, 헤더)는 번역 대상이다
- 데모 콘텐츠 중 시스템 메시지 ("분석 중입니다...", "생성 중입니다...", "완료되었습니다")는 번역 대상이다
- 데모 콘텐츠 중 AI/사용자 채팅 메시지, 파일 내용은 번역 대상이 아니다 (한국어 유지)
- 산업 카테고리명과 예시 텍스트는 번역 대상이다
- 에러 메시지는 번역 대상이다

## BR-NF-05: LanguageToggle 배치 규칙

- 각 페이지 우상단에 개별 배치한다
- StartPage: 좌측 패널 상단 또는 우상단 고정
- DemoPage: 상단 바 우측 영역
- ResultPage: 헤더 우측 영역
- AdminPage: 헤더 우측 영역
- 토글은 현재 언어를 표시하고 클릭 시 반대 언어로 전환한다
- 표시 형식: "한국어" <-> "English" (또는 "KO" <-> "EN")

## BR-NF-06: 관리자 인증 규칙

- /admin 접속 시 비밀번호 입력 화면을 먼저 표시한다
- 비밀번호는 localStorage의 `aidlc-admin-auth` 키로 인증 상태를 저장한다
- 기본 비밀번호는 환경변수 `NEXT_PUBLIC_ADMIN_PASSWORD` 또는 하드코딩 기본값 "admin2026"
- 비밀번호 일치 시 대시보드를 표시한다
- 비밀번호 불일치 시 에러 메시지를 표시하고 재시도를 허용한다
- 브라우저 세션 동안 인증 상태를 유지한다 (sessionStorage)

## BR-NF-07: 대시보드 통계 계산 규칙

- 총 세션 수: logs 배열의 길이
- 완료된 세션 수: completed === true인 로그 수
- 완료율: (완료 세션 / 총 세션) * 100, 소수점 1자리 반올림
- 평균 소요 시간: 완료된 세션의 durationMs 평균, 초 단위로 변환하여 표시
- 세션이 0개일 때 모든 통계는 0으로 표시한다

## BR-NF-08: 산업별 분포 계산 규칙

- DemoLog의 industry 필드를 기준으로 그룹핑한다
- industry가 없는 로그는 "기타" 카테고리로 분류한다
- 각 산업의 count와 percentage를 계산한다
- percentage = (해당 산업 count / 총 세션) * 100
- count 내림차순으로 정렬한다

## BR-NF-09: 세션 추이 계산 규칙

- timestamp를 시간대별(HH:00)로 그룹핑한다
- 각 시간대의 세션 수를 count한다
- 시간순으로 정렬한다
- 데이터가 없는 시간대는 포함하지 않는다

## BR-NF-10: 인기 아이디어 추출 규칙

- projectIdea를 정규화(trim, lowercase)하여 그룹핑한다
- 동일/유사 아이디어를 count한다
- count 내림차순으로 정렬한다
- 상위 5개만 표시한다

## BR-NF-11: 대시보드 데이터 로드 규칙

- 페이지 로드 시 GET /api/log를 1회 호출한다
- 자동 새로고침은 하지 않는다 (수동 새로고침 버튼 제공)
- 새로고침 버튼 클릭 시 GET /api/log를 다시 호출한다
- 데이터 로드 중 로딩 상태를 표시한다
- 데이터 로드 실패 시 에러 메시지를 표시한다

## BR-NF-12: CSS-only 차트 규칙

- 산업별 분포: 수평 바 차트 (CSS width percentage 기반)
- 세션 추이: 수직 바 차트 (CSS height percentage 기반)
- 바의 최대값을 100%로 설정하고 나머지를 비례 계산한다
- 바에 호버 시 정확한 수치를 툴팁으로 표시한다 (CSS :hover + ::after)
- 차트 색상: Kiro 테마 그라디언트 (#7c5cfc ~ #4a9eff)

## BR-NF-13: DemoLog industry 필드 추가 규칙

- POST /api/log 요청 시 industry 필드를 선택적으로 포함할 수 있다
- LogService.logStart() 호출 시 scenarioDetector 결과의 domain을 industry로 전달한다
- 기존 로그(industry 없음)와의 하위 호환성을 유지한다
- industry 필드가 없는 로그는 산업별 분포에서 "기타"로 분류한다

## BR-NF-14: 관리자 대시보드 다국어 규칙

- AdminPage의 모든 레이블, 제목, 버튼 텍스트는 다국어 지원한다
- 차트 제목, 테이블 헤더도 다국어 지원한다
- 데이터 값(프로젝트 아이디어, 타임스탬프)은 번역하지 않는다
- 비밀번호 입력 화면도 다국어 지원한다
