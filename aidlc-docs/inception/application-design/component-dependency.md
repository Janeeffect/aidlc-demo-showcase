# AI-DLC Demo Showcase - Component Dependencies

## 의존성 매트릭스

| Component | 의존 대상 | 의존 유형 |
|-----------|----------|----------|
| StartPage | DemoSessionContext | State |
| DemoPage | KiroIDELayout, AnimationOrchestrator, AIService, DemoSessionContext | UI, Animation, Service, State |
| ResultPage | MVPPreview, AWSArchitectureDiagram, DemoSessionContext | UI, State |
| KiroIDELayout | FileExplorer, CodeEditor | UI |
| FileExplorer | - | - |
| CodeEditor | TypingEffect | Animation |
| PhaseIndicator | DemoSessionContext | State |
| MVPPreview | - | - |
| AWSArchitectureDiagram | - | - |
| MousePointer | - | - |
| AnimationOrchestrator | MousePointer, TypingEffect | Animation |
| TypingEffect | - | - |
| DemoSessionContext | - | - |
| AIService | LLM API (External) | External |
| EstimateService | AIService | Service |
| LogService | LogStore | Storage |

---

## 의존성 다이어그램

```
                              ┌─────────────────┐
                              │   StartPage     │
                              └────────┬────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │   DemoPage      │
                              └────────┬────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
              ▼                        ▼                        ▼
    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
    │  KiroIDELayout  │    │  Animation      │    │  AIService      │
    │                 │    │  Orchestrator   │    │  (API)          │
    └────────┬────────┘    └────────┬────────┘    └─────────────────┘
             │                      │
    ┌────────┴────────┐    ┌────────┴────────┐
    │                 │    │                 │
    ▼                 ▼    ▼                 ▼
┌──────────┐   ┌──────────┐ ┌──────────┐ ┌──────────┐
│  File    │   │  Code    │ │  Mouse   │ │  Typing  │
│ Explorer │   │  Editor  │ │  Pointer │ │  Effect  │
└──────────┘   └────┬─────┘ └──────────┘ └──────────┘
                    │
                    ▼
              ┌──────────┐
              │  Typing  │
              │  Effect  │
              └──────────┘


                              ┌─────────────────┐
                              │   ResultPage    │
                              └────────┬────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
              ▼                        ▼                        ▼
    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
    │   MVPPreview    │    │  AWSArchitecture│    │  Estimate       │
    │                 │    │  Diagram        │    │  Service        │
    └─────────────────┘    └─────────────────┘    └────────┬────────┘
                                                           │
                                                           ▼
                                                  ┌─────────────────┐
                                                  │   AIService     │
                                                  └─────────────────┘


                    ┌─────────────────────────────────────┐
                    │        DemoSessionContext           │
                    │         (Global State)              │
                    └─────────────────┬───────────────────┘
                                      │
        ┌─────────────┬───────────────┼───────────────┬─────────────┐
        │             │               │               │             │
        ▼             ▼               ▼               ▼             ▼
   StartPage     DemoPage       ResultPage     PhaseIndicator   API Routes
```

---

## 데이터 흐름

### 1. 데모 시작 플로우

```
User Input
    │
    ▼
StartPage
    │ projectIdea
    ▼
DemoSessionContext.initSession()
    │ sessionId
    ▼
/api/demo/start
    │
    ▼
LogService.saveLog()
    │
    ▼
Navigate to DemoPage
```

### 2. AI 스트리밍 플로우

```
DemoPage
    │ phase, stage
    ▼
/api/demo/stream (SSE)
    │
    ▼
AIService.streamResponse()
    │ AsyncGenerator<AIChunk>
    ▼
AnimationOrchestrator
    │
    ├─► MousePointer.moveTo()
    │
    ├─► FileExplorer.addFile()
    │
    └─► CodeEditor.setContentWithTyping()
            │
            ▼
        TypingEffect
```

### 3. 결과 생성 플로우

```
DemoPage (onComplete)
    │ generatedContent
    ▼
/api/demo/estimate
    │
    ├─► EstimateService.calculateEstimate()
    │       │
    │       ▼
    │   AIService (동적 추정)
    │
    ├─► AIService.generateMVPCode()
    │
    └─► AIService.generateAWSArchitecture()
            │
            ▼
        DemoResult
            │
            ▼
        ResultPage
            │
            ├─► MVPPreview.renderDynamicComponent()
            │
            └─► AWSArchitectureDiagram.renderDiagram()
```

---

## 통신 패턴

### 1. 컴포넌트 간 통신

| 패턴 | 사용 위치 | 설명 |
|------|----------|------|
| Props Drilling | Pages → UI Components | 부모에서 자식으로 데이터 전달 |
| Context | DemoSessionContext | 전역 상태 공유 |
| Callbacks | Animation → Parent | 완료 이벤트 전달 |

### 2. 클라이언트-서버 통신

| 패턴 | API | 설명 |
|------|-----|------|
| REST | /api/demo/start, /api/log | 일반 요청/응답 |
| SSE | /api/demo/stream | 스트리밍 응답 |
| REST | /api/demo/estimate | 결과 계산 |

---

## 외부 의존성

| 의존성 | 용도 | 대안 |
|--------|------|------|
| LLM API | AI 콘텐츠 생성 | OpenAI, Anthropic, Bedrock |
| Next.js | 풀스택 프레임워크 | - |
| React | UI 라이브러리 | - |
| Tailwind CSS | 스타일링 | - |
| Framer Motion | 애니메이션 | CSS Animations |

---

## 초기화 순서

```
1. Next.js App 초기화
    │
    ▼
2. DemoSessionContext Provider 마운트
    │
    ▼
3. StartPage 렌더링
    │
    ▼
4. (사용자 입력 후)
    │
    ▼
5. DemoPage 마운트
    │
    ├─► KiroIDELayout 초기화
    │
    ├─► AnimationOrchestrator 초기화
    │
    └─► AI 스트리밍 연결
```
