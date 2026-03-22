# AI-DLC Demo Showcase - Components (Brownfield Update)

## 컴포넌트 개요

```
+-------------------------------------------------------------------+
|                        Web Application                             |
+-------------------------------------------------------------------+
|  +-------------+  +-------------+  +-------------+  +-----------+ |
|  |   Pages     |  |    UI       |  |  Animation  |  |   i18n    | |
|  |  (4 pages)  |  | Components  |  |   System    |  |  System   | |
|  +------+------+  +------+------+  +------+------+  +-----+-----+ |
|         |                |                |                |       |
|         +----------------+----------------+----------------+       |
|                          |                                         |
|  +-----------------------------------------------------------+   |
|  |              State Management                              |   |
|  |    DemoSessionContext  |  LanguageContext (NEW)             |   |
|  +----------------------------+------------------------------+   |
|                               |                                   |
+-------------------------------+-----------------------------------+
|                               |           API Layer               |
|  +----------------------------+------------------------------+   |
|  |              API Routes (Next.js)                          |   |
|  |    /api/demo/start  /api/demo/send-report  /api/log       |   |
|  +----------------------------+------------------------------+   |
|                               |                                   |
|  +----------------------------+------------------------------+   |
|  |              Services / Utils Layer                        |   |
|  |  ScenarioDetector | DemoStepGenerator | EstimateService   |   |
|  |  LogService       | useDemoProgress   | useRunStep       |   |
|  +-----------------------------------------------------------+   |
+-------------------------------------------------------------------+
```

### Text Alternative
- 4개 페이지 (Start, Demo, Result, Admin)
- UI 컴포넌트 (Kiro IDE, Result UI, MVP Previews)
- Animation 시스템 (Orchestrator, MousePointer, TypingEffect) - DemoPage에 통합
- i18n 시스템 (한/영 다국어)
- 상태 관리 (DemoSessionContext + LanguageContext)
- API Routes (start, send-report, log) - stream/estimate 삭제
- 서비스/유틸 (ScenarioDetector, DemoStepGenerator, EstimateService, LogService, 커스텀 훅)

---

## 1. Pages (4개)

### 1.1 StartPage (기존 - 수정)
**파일**: `src/app/page.tsx`
**변경**: 접근성 개선, 다국어 지원, 로그 연동 추가

**책임**:
- AI-DLC 브랜딩 표시
- 프로젝트 아이디어 입력 폼
- 6개 산업 카테고리별 예시 제공
- 데모 시작 트리거
- [NEW] 언어 전환 토글 표시
- [NEW] 세션 시작 로그 기록 (LogService)
- [NEW] aria-label, 키보드 네비게이션

### 1.2 DemoPage (기존 - 대폭 리팩토링)
**파일**: `src/app/demo/page.tsx` (200 라인 이하로 축소)
**변경**: God Component 해소, Animation 통합, 모듈 분리

**책임**:
- Kiro IDE 레이아웃 렌더링 (KiroIDELayout)
- [MOVED] 시나리오 감지 -> ScenarioDetector
- [MOVED] 단계 생성 -> DemoStepGenerator
- [MOVED] 단계 실행 -> useRunStep 훅
- [MOVED] 진행 상태 관리 -> useDemoProgress 훅
- [NEW] Animation 시스템 통합 (마우스 포인터, 타이핑 효과)
- [NEW] 접근성 (aria-live, 키보드 네비게이션)
- [NEW] 다국어 UI 텍스트

### 1.3 ResultPage (기존 - 수정)
**파일**: `src/app/result/page.tsx`
**변경**: 접근성, 다국어, 에러 핸들링, 로그 연동

**책임**:
- 6개 탭 결과 표시 (MVP, AWS, 워크플로우, 예상, 산출물, Kiro)
- 이메일 리포트 모달
- [NEW] 세션 완료 로그 기록 (LogService)
- [NEW] 이메일 전송 실패 시 에러 메시지 표시
- [NEW] 키보드 탭 네비게이션 (Arrow keys)
- [NEW] 다국어 UI 텍스트

### 1.4 AdminPage (신규)
**파일**: `src/app/admin/page.tsx`

**책임**:
- 대시보드 메인 통계 카드 (총 세션, 완료율, 평균 시간)
- 최근 세션 로그 테이블
- 인기 프로젝트 아이디어 목록
- 산업별 분포 차트
- 세션 추이 차트
- 다국어 지원

---

## 2. Kiro IDE Components (기존 - 수정)

### 2.1 KiroIDELayout (수정)
**파일**: `src/components/kiro-ide/KiroIDELayout.tsx`
**변경**: Animation 통합, 접근성

**책임**:
- IDE 전체 레이아웃 (타이틀바, 파일탐색기, 에디터, 채팅)
- [NEW] MousePointer 오버레이 렌더링
- [NEW] aria 랜드마크 (role="main", role="navigation")

### 2.2 FileExplorer (수정)
**파일**: `src/components/kiro-ide/FileExplorer.tsx`
**변경**: 키보드 네비게이션, 접근성

**책임**:
- 파일 트리 재귀적 렌더링
- [NEW] 키보드 네비게이션 (Arrow up/down, Enter)
- [NEW] aria-label, role="tree", role="treeitem"

### 2.3 CodeEditor (기존 유지)
**파일**: `src/components/kiro-ide/CodeEditor.tsx`

### 2.4 PhaseIndicator (수정)
**파일**: `src/components/kiro-ide/PhaseIndicator.tsx`
**변경**: 메모이제이션, 접근성

**책임**:
- AI-DLC 진행 상태 표시
- [NEW] useMemo로 phaseConfigs 메모이제이션
- [NEW] aria-label, role="progressbar"

---

## 3. Animation System (기존 미사용 -> DemoPage 통합)

### 3.1 MousePointer (활용)
**파일**: `src/components/animation/MousePointer.tsx`
**변경**: DemoPage에서 실제 사용하도록 통합

**책임**:
- 가상 마우스 커서 렌더링
- 부드러운 이동 애니메이션 (ease-in-out)
- 클릭 시각적 피드백 (ripple/scale)
- 파일 탐색기 파일 클릭, 채팅 입력, 버튼 클릭, 탭 전환, 스크롤 시뮬레이션

### 3.2 AnimationOrchestrator (활용)
**파일**: `src/components/animation/AnimationOrchestrator.tsx`
**변경**: DemoPage의 runStep과 통합

**책임**:
- 단계별 애니메이션 시퀀스 관리
- 마우스 이동 -> 클릭 -> 타이핑 -> 파일 생성 순서 조율
- 취소/복원 메커니즘

### 3.3 TypingEffect (활용)
**파일**: `src/components/animation/TypingEffect.tsx`
**변경**: CodeEditor 타이핑과 통합

**책임**:
- 문자 단위 점진적 표시
- 타이핑 속도 제어

---

## 4. Result UI Components (수정)

### 4.1 MVPPreview (분리)
**파일**: `src/components/ui/MVPPreview.tsx` -> 산업별 하위 컴포넌트로 분리
**신규 디렉토리**: `src/components/ui/mvp-previews/`

**분리 구조**:
- `MVPPreview.tsx` - 메인 컨테이너 (lazy loading 관리)
- `mvp-previews/EcommerceMVP.tsx` - 이커머스
- `mvp-previews/BookingMVP.tsx` - 예약
- `mvp-previews/LearningMVP.tsx` - 학습
- `mvp-previews/ChatMVP.tsx` - 채팅
- `mvp-previews/DashboardMVP.tsx` - 대시보드

### 4.2 AWSArchitectureDiagram (수정)
**변경**: Mermaid 로딩 shimmer 효과 개선

### 4.3 BusinessWorkflowDiagram (기존 유지)

### 4.4 ResultSummary (수정)
**변경**: 다국어 지원

---

## 5. 신규 모듈 (DemoPage 리팩토링)

### 5.1 ScenarioDetector
**파일**: `src/utils/scenarioDetector.ts`

**책임**:
- 사용자 입력 키워드 분석
- 8개 산업 시나리오 중 하나 반환
- 시나리오 데이터 외부화 (설정 파일)

### 5.2 DemoStepGenerator
**파일**: `src/utils/demoStepGenerator.ts`

**책임**:
- detectScenario 결과 기반 7개 데모 단계 생성
- 각 단계의 chatSequence, fileContent, animationSequence 생성

### 5.3 useDemoProgress Hook
**파일**: `src/hooks/useDemoProgress.ts`

**책임**:
- currentStep, isAnimating, stepCompleted 상태 관리
- handleNextStep, handlePrevStep 로직
- 진행률 계산

### 5.4 useRunStep Hook
**파일**: `src/hooks/useRunStep.ts`

**책임**:
- runStep 비동기 실행 로직
- runIdRef 취소 메커니즘
- 채팅 메시지 시뮬레이션 타이밍
- Animation 시퀀스 트리거

---

## 6. i18n System (신규)

### 6.1 LanguageContext
**파일**: `src/contexts/LanguageContext.tsx`

**책임**:
- 현재 언어 상태 관리 (ko/en)
- localStorage 영속화
- 언어 전환 함수 제공

### 6.2 Translation Files
**디렉토리**: `src/i18n/`

**구조**:
- `src/i18n/ko.ts` - 한국어 번역
- `src/i18n/en.ts` - 영어 번역
- `src/i18n/index.ts` - useTranslation 훅

### 6.3 LanguageToggle
**파일**: `src/components/ui/LanguageToggle.tsx`

**책임**:
- 한국어/영어 전환 토글 UI
- 모든 페이지 헤더에 표시

---

## 7. State Management (수정)

### 7.1 DemoSessionContext (기존 유지)
**파일**: `src/contexts/DemoSessionContext.tsx`

### 7.2 LanguageContext (신규)
**파일**: `src/contexts/LanguageContext.tsx`

---

## 8. API Routes (정리)

### 8.1 /api/demo/start (기존 유지)
**변경**: 에러 응답 형식 통일

### 8.2 /api/demo/send-report (기존 유지)
**변경**: 에러 응답 형식 통일

### 8.3 /api/log (기존 - 실제 연동)
**변경**: DemoPage/ResultPage에서 실제 호출, 관리자 대시보드 데이터 제공

### 8.4 삭제 대상
- ~~`/api/demo/stream`~~ (삭제)
- ~~`/api/demo/estimate`~~ (삭제)

---

## 9. Services (정리)

### 9.1 EstimateService (기존 유지)
**파일**: `src/services/EstimateService.ts`

### 9.2 LogService (수정 - 실제 연동)
**파일**: `src/services/LogService.ts`
**변경**: StartPage/ResultPage에서 실제 호출

### 9.3 삭제 대상
- ~~`AIService`~~ (삭제 - 미사용)
