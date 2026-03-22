# Business Rules - Unit 1: 코드 정리

## BR-01: 시나리오 매칭 규칙

### BR-01.1: 키워드 가중치 매칭
- 각 시나리오는 `keywords: string[]`와 `priority: number`를 가진다
- 사용자 입력에서 매칭된 키워드 수가 시나리오의 매칭 점수가 된다
- priority가 높은 키워드(배열 앞쪽)는 가중치 1.5, 나머지는 1.0
- 최고 점수 시나리오를 반환한다
- 동점 시 시나리오 정의 순서에서 먼저 나오는 것을 선택한다

### BR-01.2: 기본 시나리오 폴백
- 어떤 시나리오도 매칭 점수 > 0이 아니면 'default' (범용 웹 서비스) 시나리오를 반환한다
- 빈 문자열 입력 시에도 기본 시나리오를 반환한다 (에러 발생 안 함)

### BR-01.3: 입력 정규화
- 입력 텍스트를 `toLowerCase()`로 변환 후 매칭한다
- 공백, 특수문자는 제거하지 않는다 (키워드가 한국어 단어 단위이므로)

---

## BR-02: 데모 단계 생성 규칙

### BR-02.1: 고정 7단계 구조
- 데모는 항상 7개 단계로 구성된다 (시나리오와 무관)
- 단계 순서: 요구사항 -> 스토리 -> 설계 -> NFR -> 코드 -> 인프라 -> 배포
- 각 단계는 Phase/Stage 매핑이 고정되어 있다

### BR-02.2: 메시지 ID 고유성
- chatSequence의 메시지 ID는 전체 단계를 통틀어 순차 증가한다
- 단계 완료 메시지 ID는 `complete-{stepIdx}` 형식이다

### BR-02.3: 파일 콘텐츠 템플릿
- fileContent는 시나리오 데이터를 Markdown 템플릿에 삽입하여 생성한다
- 모든 fileContent는 한국어로 작성된다
- 마지막 줄에 "상태: 완료"를 포함한다

---

## BR-03: 데모 진행 상태 규칙

### BR-03.1: 단계 전환 조건
- 다음 단계 이동: `!isAnimating && stepCompleted` 일 때만 가능
- 이전 단계 이동: `currentStep > 0 && !isAnimating` 일 때만 가능
- 마지막 단계에서 "다음"은 결과 페이지로 라우팅

### BR-03.2: 진행률 계산
- `progress = Math.round(((currentStep + 1) / totalSteps) * 100)`
- 0단계 시작 시 progress = 14 (1/7 * 100)
- 마지막 단계 완료 시 progress = 100

### BR-03.3: 초기 자동 시작
- DemoPage 진입 시 projectIdea가 있으면 자동으로 Step 0 실행
- projectIdea가 없으면 시작 페이지로 리다이렉트
- 자동 시작은 1회만 실행 (useRef로 중복 방지)

---

## BR-04: 단계 실행 규칙

### BR-04.1: 메시지 타이밍
- ai 메시지: 타이핑 인디케이터 800ms -> 메시지 표시
- user 메시지: 400ms 대기 -> 메시지 표시
- system 메시지: 200ms 대기 -> 메시지 표시
- 파일 생성 전 대기: 500ms

### BR-04.2: 취소 안전성
- 새 단계 실행 시 이전 실행은 자동 취소된다
- 취소는 runIdRef 비교로 감지한다
- 취소된 실행은 상태를 변경하지 않고 즉시 종료한다
- 에러 발생 시에도 isAnimating=false, stepCompleted=true로 복구한다

### BR-04.3: 이전 단계 메시지 보존
- 단계 실행 시 이전 단계들의 chatSequence를 모두 포함한다
- 이전 단계로 돌아가면 해당 단계까지의 메시지만 표시한다

### BR-04.4: 파일 콘텐츠 캐싱
- 생성된 파일의 콘텐츠는 fileContentsMap에 캐싱한다
- 파일 클릭 시 캐시에서 콘텐츠를 로드한다

---

## BR-05: LogService 연동 규칙

### BR-05.1: Fire-and-forget 패턴
- 모든 LogService 호출은 fire-and-forget으로 실행한다
- `.catch(() => {})` 로 에러를 무시한다
- 로그 실패가 사용자 경험에 영향을 주지 않는다

### BR-05.2: 호출 시점
- 세션 시작 로그: StartPage에서 데모 시작 버튼 클릭 시
- 세션 완료 로그: ResultPage 진입 시 (useEffect)
- sessionId: DemoSessionContext에서 제공

### BR-05.3: 중복 호출 방지
- StartPage: 버튼 클릭 이벤트에서 1회 호출 (자연스럽게 중복 방지)
- ResultPage: useEffect + useRef로 1회만 호출

---

## BR-06: 미사용 코드 삭제 규칙

### BR-06.1: 삭제 대상 판별 기준
- 어떤 소스 파일에서도 import되지 않는 모듈
- 어떤 API 클라이언트에서도 호출되지 않는 API Route
- Reverse Engineering에서 "미사용"으로 식별된 코드

### BR-06.2: 삭제 순서
1. 먼저 참조하는 테스트 파일 삭제
2. 그 다음 대상 파일 삭제
3. 삭제 후 빌드 검증

### BR-06.3: 삭제 대상 목록 (확정)
- `src/app/api/demo/stream/route.ts` - DemoPage가 클라이언트 사이드 생성
- `src/app/api/demo/estimate/route.ts` - EstimateService가 클라이언트 사이드
- `src/services/AIService.ts` - 어디서도 import하지 않음

---

## BR-07: DemoPage 크기 제한 규칙

### BR-07.1: 200 라인 제한
- 리팩토링 후 DemoPage는 200 라인 이하여야 한다
- DemoPage는 조합(composition)만 담당한다
- 비즈니스 로직, 데이터, 상태 관리는 모두 외부 모듈로 분리한다

### BR-07.2: DemoPage에 남는 코드
- import 문
- URL 파라미터 추출
- 훅 호출 (useDemoProgress, useRunStep, useDemoSession)
- useMemo (demoSteps 생성)
- useEffect (자동 시작)
- 이벤트 핸들러 (handleNextStep, handlePrevStep, handleFileClick, handleBack)
- JSX 렌더링 (네비게이션 바 + KiroIDELayout)
- Suspense 래핑

### BR-07.3: 분리 대상
- detectScenario() -> src/utils/scenarioDetector.ts
- 시나리오 데이터 -> src/data/scenarios.ts
- generateDemoSteps() -> src/utils/demoStepGenerator.ts
- 상태 관리 로직 -> src/hooks/useDemoProgress.ts
- runStep 로직 -> src/hooks/useRunStep.ts
- delay() -> src/utils/delay.ts (또는 useRunStep 내부)
- ChatMessage, DemoStep 인터페이스 -> src/types/demo.ts
