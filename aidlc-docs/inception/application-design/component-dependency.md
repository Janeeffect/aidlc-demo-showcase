# AI-DLC Demo Showcase - Component Dependencies (Brownfield Update)

## 의존성 매트릭스

| Component | 의존 대상 | 의존 유형 | 변경 |
|-----------|----------|----------|------|
| StartPage | DemoSessionContext, LanguageContext, LogService | State, i18n, Service | 수정 |
| DemoPage | KiroIDELayout, useDemoProgress, useRunStep, ScenarioDetector, DemoStepGenerator, AnimationOrchestrator, LanguageContext | UI, Hook, Util, Animation, i18n | 대폭 수정 |
| ResultPage | MVPPreview, AWSArchitectureDiagram, BusinessWorkflowDiagram, ResultSummary, EstimateService, LogService, LanguageContext | UI, Service, i18n | 수정 |
| AdminPage | LogService, LanguageContext | Service, i18n | 신규 |
| KiroIDELayout | FileExplorer, CodeEditor, PhaseIndicator, MousePointer | UI, Animation | 수정 |
| FileExplorer | - | - | 수정 (접근성) |
| CodeEditor | TypingEffect | Animation | 유지 |
| PhaseIndicator | DemoSessionContext | State | 수정 (메모이제이션) |
| MVPPreview | mvp-previews/* (lazy) | UI | 분리 |
| AWSArchitectureDiagram | mermaid (dynamic) | External | 수정 (shimmer) |
| BusinessWorkflowDiagram | - | - | 유지 |
| ResultSummary | qrcode.react, LanguageContext | External, i18n | 수정 |
| MousePointer | framer-motion | Animation | 활용 |
| AnimationOrchestrator | MousePointer, TypingEffect | Animation | 활용 |
| TypingEffect | - | - | 활용 |
| ScenarioDetector | scenarios data | Data | 신규 |
| DemoStepGenerator | ScenarioDetector | Util | 신규 |
| useDemoProgress | - | - | 신규 |
| useRunStep | AnimationOrchestrator | Animation | 신규 |
| LanguageContext | localStorage | Browser | 신규 |
| LanguageToggle | LanguageContext | State | 신규 |
| LogService | /api/log | API | 수정 |
| EstimateService | - | - | 유지 |

---

## 의존성 다이어그램

```
                    +-------------------+
                    |  LanguageContext   |  (NEW - 모든 페이지에서 사용)
                    +--------+----------+
                             |
     +-----------+-----------+-----------+-----------+
     |           |           |           |           |
     v           v           v           v           v
 StartPage   DemoPage   ResultPage   AdminPage  LanguageToggle
     |           |           |           |
     |           |           |           +-> LogService -> /api/log
     |           |           |
     |           |           +-> MVPPreview -> mvp-previews/* (lazy)
     |           |           +-> AWSArchitectureDiagram -> mermaid
     |           |           +-> BusinessWorkflowDiagram
     |           |           +-> ResultSummary -> qrcode.react
     |           |           +-> EstimateService
     |           |           +-> LogService -> /api/log  (NEW)
     |           |
     |           +-> ScenarioDetector -> scenarios data  (NEW)
     |           +-> DemoStepGenerator  (NEW)
     |           +-> useDemoProgress  (NEW)
     |           +-> useRunStep -> AnimationOrchestrator  (NEW)
     |           +-> KiroIDELayout
     |                  +-> FileExplorer
     |                  +-> CodeEditor -> TypingEffect
     |                  +-> PhaseIndicator
     |                  +-> MousePointer  (NEW)
     |
     +-> DemoSessionContext
     +-> LogService -> /api/log  (NEW)
     +-> /api/demo/start
```

### Text Alternative
- LanguageContext: 모든 페이지에서 공유 (신규)
- DemoPage: ScenarioDetector, DemoStepGenerator, useDemoProgress, useRunStep로 분리 (리팩토링)
- AnimationOrchestrator -> MousePointer + TypingEffect (DemoPage에 통합)
- LogService: StartPage, ResultPage, AdminPage에서 실제 호출 (신규 연동)
- MVPPreview: 산업별 하위 컴포넌트로 lazy loading (성능 최적화)

---

## 데이터 흐름 (업데이트)

### 1. 데모 시작 플로우

```
User Input (아이디어)
    |
    v
StartPage
    |-> DemoSessionContext.initSession()
    |-> POST /api/demo/start (세션 ID)
    |-> LogService.logStart()  [NEW]
    |-> router.push(/demo?idea=...)
    v
DemoPage
    |-> ScenarioDetector.detectScenario(idea)  [REFACTORED]
    |-> DemoStepGenerator.generateDemoSteps(idea)  [REFACTORED]
    |-> useDemoProgress (상태 초기화)  [REFACTORED]
```

### 2. 데모 진행 플로우 (Animation 통합)

```
useRunStep.runStep(stepIdx)
    |
    +-> AnimationOrchestrator.executeSequence()  [NEW]
    |     |
    |     +-> MousePointer.moveToElement(fileExplorer)
    |     +-> MousePointer.click()
    |     +-> MousePointer.moveToElement(chatInput)
    |     +-> TypingEffect.startTyping(message)
    |     +-> MousePointer.moveToElement(sendButton)
    |     +-> MousePointer.click()
    |
    +-> 채팅 메시지 추가 (AI/User/System)
    +-> 파일 추가 (Context)
    +-> 에디터 콘텐츠 설정
    +-> 진행률 업데이트
    +-> 완료 시 stepCompleted = true
```

### 3. 결과 조회 플로우

```
DemoPage 완료 -> router.push(/result?idea=...)
    |
    v
ResultPage
    |-> EstimateService.calculateEstimate(idea)
    |-> LogService.logComplete()  [NEW]
    |-> 6개 탭 렌더링
         |-> MVPPreview (lazy loading)  [OPTIMIZED]
         |-> AWSArchitectureDiagram (shimmer)  [OPTIMIZED]
         |-> BusinessWorkflowDiagram
         |-> ResultSummary
```

### 4. 관리자 대시보드 플로우 (신규)

```
AdminPage
    |-> GET /api/log (통계 조회)
    |-> 통계 카드 렌더링
    |-> 세션 로그 테이블
    |-> 산업별 분포 차트
    |-> 세션 추이 차트
```

---

## 통신 패턴

| 패턴 | 사용 위치 | 설명 |
|------|----------|------|
| Props | Pages -> UI Components | 부모에서 자식으로 데이터 전달 |
| Context | DemoSessionContext | 데모 세션 전역 상태 |
| Context | LanguageContext (NEW) | 다국어 전역 상태 |
| Custom Hook | useDemoProgress, useRunStep (NEW) | 데모 진행 로직 캡슐화 |
| Custom Hook | useTranslation (NEW) | 번역 함수 제공 |
| REST | /api/demo/start, /api/demo/send-report, /api/log | HTTP 요청/응답 |
| Callbacks | Animation -> useRunStep | 애니메이션 완료 이벤트 |
| Lazy Import | MVPPreview -> mvp-previews/* (NEW) | 동적 컴포넌트 로딩 |
| Dynamic Import | AWSArchitectureDiagram -> mermaid | 라이브러리 동적 로딩 |

---

## 구현 순서 (의존성 기반)

```
Phase 1: 기반 작업 (의존성 없음)
  +-> ScenarioDetector + scenarios data
  +-> DemoStepGenerator
  +-> useDemoProgress
  +-> useRunStep
  +-> LanguageContext + translations
  +-> API 에러 응답 통일

Phase 2: 핵심 변경 (Phase 1 의존)
  +-> DemoPage 리팩토링 (Phase 1 모듈 사용)
  +-> Animation 통합 (MousePointer, Orchestrator)
  +-> LogService 실제 연동

Phase 3: 품질 개선 (Phase 1~2 의존)
  +-> 접근성 개선 (모든 컴포넌트)
  +-> 성능 최적화 (MVPPreview 분리, 메모이제이션, Image)
  +-> 미사용 코드 삭제 (stream, estimate API, AIService)

Phase 4: 신규 기능 (Phase 1~3 의존)
  +-> AdminPage
  +-> LanguageToggle + 다국어 적용
  +-> 에러 핸들링 UI

Phase 5: 마무리
  +-> 통합 테스트
  +-> 빌드 검증
```
