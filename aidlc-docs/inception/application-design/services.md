# AI-DLC Demo Showcase - Services (Brownfield Update)

## 서비스 아키텍처 개요

```
+-------------------------------------------------------------------+
|                      Client (Browser)                              |
|  +-------------------------------------------------------------+ |
|  |              React Components                                 | |
|  |   StartPage -> DemoPage -> ResultPage    AdminPage            | |
|  +------------------------------+------------------------------+ |
|                                  |                                 |
|     +----------------------------+----------------------------+   |
|     |          Client-Side Services                            |   |
|     |  ScenarioDetector | DemoStepGenerator | EstimateService  |   |
|     |  useDemoProgress  | useRunStep        | useTranslation   |   |
|     +----------------------------+----------------------------+   |
|                                  |                                 |
|                                  | HTTP                            |
|                                  v                                 |
+-------------------------------------------------------------------+
|                    Next.js API Routes                              |
|  +--------------+ +------------------+ +--------------+           |
|  | /api/demo/   | | /api/demo/       | |  /api/log    |           |
|  |    start     | |   send-report    | |              |           |
|  +------+-------+ +--------+---------+ +------+-------+           |
|         |                   |                  |                   |
|         v                   v                  v                   |
|  +-------------------------------------------------------------+ |
|  |                  Server-Side Services                         | |
|  |  LogService (In-memory storage)                               | |
|  +-------------------------------------------------------------+ |
+-------------------------------------------------------------------+
```

### Text Alternative
- Client-Side: ScenarioDetector, DemoStepGenerator, EstimateService, 커스텀 훅
- API Routes: /api/demo/start, /api/demo/send-report, /api/log
- Server-Side: LogService (In-memory)
- 삭제됨: AIService, /api/demo/stream, /api/demo/estimate

---

## 1. ScenarioDetector (신규 - DemoPage에서 분리)

### 목적
사용자 입력 키워드를 분석하여 산업별 시나리오를 감지

### 책임
- 키워드 매칭으로 8개 산업 시나리오 분류
- 시나리오별 데이터 반환 (features, techStack, awsServices 등)
- 시나리오 데이터 외부화 (확장 용이)

### 위치
- `src/utils/scenarioDetector.ts` - 감지 로직
- `src/data/scenarios.ts` - 시나리오 데이터 (외부화)

---

## 2. DemoStepGenerator (신규 - DemoPage에서 분리)

### 목적
감지된 시나리오를 기반으로 7개 데모 단계를 생성

### 책임
- 단계별 chatSequence 생성
- 단계별 fileContent 생성
- [NEW] 단계별 animationSequence 생성 (마우스 이동, 클릭, 타이핑)

### 위치
- `src/utils/demoStepGenerator.ts`

---

## 3. EstimateService (기존 유지)

### 목적
프로젝트 아이디어의 키워드를 분석하여 개발 기간, 팀 구성, 비용을 산출

### 책임
- 복잡도 분석 (키워드 기반)
- 개발 일수 계산
- AI 절감 효과 산출
- 팀 구성 추천

### 위치
- `src/services/EstimateService.ts` (변경 없음)

---

## 4. LogService (수정 - 실제 연동)

### 목적
데모 세션 로그를 서버에 기록하고 통계 제공

### 책임
- 세션 시작/완료 로그 기록
- 통계 조회 (관리자 대시보드용)
- [NEW] StartPage에서 세션 시작 시 실제 호출
- [NEW] ResultPage에서 세션 완료 시 실제 호출
- [NEW] AdminPage에서 통계 조회

### 위치
- `src/services/LogService.ts` (클라이언트)
- `src/app/api/log/route.ts` (서버)

### 서버 측 저장
- In-memory 배열 (현재 - 서버 재시작 시 초기화)
- 향후 DB 연동 가능한 인터페이스 유지

---

## 5. i18n Service (신규)

### 목적
한국어/영어 다국어 지원

### 책임
- 번역 키-값 관리
- 현재 언어 상태 관리 (localStorage 영속화)
- useTranslation 훅 제공

### 위치
- `src/i18n/ko.ts` - 한국어 번역
- `src/i18n/en.ts` - 영어 번역
- `src/i18n/index.ts` - useTranslation 훅
- `src/contexts/LanguageContext.tsx` - 언어 상태 Context

---

## 6. 삭제 대상

### AIService (삭제)
- **사유**: DemoPage가 클라이언트 사이드에서 직접 콘텐츠 생성 (generateDemoSteps). 실제 LLM 호출 없음.
- **향후**: LLM 연동 시 새로 생성

---

## 서비스 간 상호작용 (업데이트)

### 데모 플로우 시퀀스

```
1. 사용자 입력 -> StartPage
   +-> POST /api/demo/start (세션 ID 생성)
   +-> LogService.logStart() -> POST /api/log (세션 시작 기록)  [NEW]
   +-> router.push(/demo?idea=...)

2. 데모 진행 -> DemoPage
   +-> ScenarioDetector.detectScenario(idea)  [REFACTORED]
   +-> DemoStepGenerator.generateDemoSteps(idea)  [REFACTORED]
   +-> useRunStep.runStep(0)  [REFACTORED]
       +-> AnimationOrchestrator.executeSequence()  [NEW]
       +-> MousePointer.moveTo() / click()  [NEW]
       +-> 채팅 메시지 시뮬레이션
       +-> 파일 생성 + 에디터 콘텐츠

3. 결과 조회 -> ResultPage
   +-> EstimateService.calculateEstimate(idea)
   +-> LogService.logComplete() -> POST /api/log (완료 기록)  [NEW]
   +-> 6개 탭 렌더링

4. 관리자 -> AdminPage  [NEW]
   +-> GET /api/log (통계 조회)
   +-> 차트/테이블 렌더링
```
