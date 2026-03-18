# AI-DLC Demo Showcase - Component Methods

## 1. Pages Methods

### StartPage
```typescript
// 데모 시작 처리
handleStart(projectIdea: string): void

// 예시 프로젝트 선택
handleExampleSelect(example: string): void

// 입력 유효성 검사
validateInput(input: string): boolean
```

### DemoPage
```typescript
// 데모 초기화
initializeDemo(projectIdea: string): Promise<void>

// AI 스트리밍 시작
startAIStream(phase: Phase, stage: Stage): Promise<void>

// 애니메이션 스텝 실행
executeAnimationStep(step: AnimationStep): Promise<void>

// Phase 전환
transitionToPhase(nextPhase: Phase): void

// 데모 완료 처리
handleDemoComplete(result: DemoResult): void
```

### ResultPage
```typescript
// MVP 컴포넌트 렌더링
renderMVPComponent(code: string): ReactNode

// 아키텍처 다이어그램 생성
generateArchitectureDiagram(services: AWSService[]): void

// QR 코드 생성
generateQRCode(url: string): string

// 리셋 처리
handleReset(): void
```

---

## 2. UI Components Methods

### KiroIDELayout
```typescript
// 레이아웃 초기화
initializeLayout(): void

// 패널 크기 조정
resizePanel(panel: 'explorer' | 'editor' | 'terminal', size: number): void

// 탭 추가
addTab(fileName: string): void

// 탭 활성화
activateTab(fileName: string): void
```

### FileExplorer
```typescript
// 파일 트리 렌더링
renderFileTree(nodes: FileTreeNode[]): ReactNode

// 파일 추가 (애니메이션 포함)
addFile(path: string, type: 'file' | 'folder'): Promise<void>

// 폴더 토글
toggleFolder(path: string): void

// 파일 선택
selectFile(path: string): void
```

### CodeEditor
```typescript
// 콘텐츠 설정 (타이핑 효과)
setContentWithTyping(content: string, speed: number): Promise<void>

// 즉시 콘텐츠 설정
setContentImmediate(content: string): void

// 구문 하이라이팅 적용
applySyntaxHighlighting(content: string, language: string): string

// 스크롤 위치 조정
scrollToLine(lineNumber: number): void
```

### PhaseIndicator
```typescript
// Phase 업데이트
updatePhase(phase: Phase): void

// Stage 업데이트
updateStage(stage: Stage): void

// 진행률 업데이트
updateProgress(progress: number): void
```

### MVPPreview
```typescript
// 동적 컴포넌트 렌더링
renderDynamicComponent(code: string): ReactNode

// 디바이스 프레임 전환
switchDeviceFrame(type: 'mobile' | 'desktop'): void

// 인터랙션 핸들링
handleInteraction(event: InteractionEvent): void
```

### AWSArchitectureDiagram
```typescript
// 다이어그램 렌더링
renderDiagram(services: AWSService[], connections: ServiceConnection[]): void

// 서비스 노드 추가 (애니메이션)
addServiceNode(service: AWSService): Promise<void>

// 연결선 추가 (애니메이션)
addConnection(connection: ServiceConnection): Promise<void>
```

---

## 3. Animation System Methods

### MousePointer
```typescript
// 위치로 이동 (애니메이션)
moveTo(x: number, y: number, duration: number): Promise<void>

// 클릭 애니메이션
click(): Promise<void>

// 더블 클릭 애니메이션
doubleClick(): Promise<void>

// 표시/숨김
setVisible(visible: boolean): void
```

### AnimationOrchestrator
```typescript
// 애니메이션 시퀀스 시작
start(): Promise<void>

// 일시정지
pause(): void

// 재개
resume(): void

// 스텝 실행
executeStep(step: AnimationStep): Promise<void>

// 속도 설정
setSpeed(speed: number): void

// 현재 스텝 가져오기
getCurrentStep(): AnimationStep | null
```

### TypingEffect
```typescript
// 타이핑 시작
startTyping(): Promise<void>

// 타이핑 중지
stopTyping(): void

// 속도 변경
setSpeed(speed: number): void

// 즉시 완료
completeImmediately(): void
```

---

## 4. State Management Methods

### DemoSessionContext
```typescript
// 세션 초기화
initSession(projectIdea: string): string // returns sessionId

// Phase 업데이트
setPhase(phase: Phase): void

// Stage 업데이트
setStage(stage: Stage): void

// 파일 추가
addFile(file: FileTreeNode): void

// AI 응답 추가
addAIResponse(response: AIResponse): void

// 진행률 업데이트
setProgress(progress: number): void

// 결과 설정
setResult(result: DemoResult): void

// 세션 리셋
resetSession(): void

// 세션 상태 가져오기
getSessionState(): DemoSessionState
```

---

## 5. API Routes Methods

### /api/demo/start (POST)
```typescript
// Request
interface StartDemoRequest {
  projectIdea: string;
}

// Response
interface StartDemoResponse {
  sessionId: string;
  status: 'started';
}
```

### /api/demo/stream (GET)
```typescript
// Query Parameters
interface StreamParams {
  sessionId: string;
  phase: Phase;
  stage: Stage;
}

// Response: Server-Sent Events
// event: content
// data: { type: 'text' | 'code' | 'file', content: string }
```

### /api/demo/estimate (POST)
```typescript
// Request
interface EstimateRequest {
  sessionId: string;
  projectIdea: string;
  generatedContent: GeneratedContent;
}

// Response
interface EstimateResponse {
  traditionalDays: number;
  teamComposition: TeamMember[];
  estimatedDuration: string;
  estimatedTeamSize: number;
}
```

### /api/log (POST)
```typescript
// Request
interface LogRequest {
  sessionId: string;
  projectIdea: string;
  completed: boolean;
  durationMs: number;
}

// Response
interface LogResponse {
  status: 'logged';
}
```

---

## 6. Services Methods

### AIService
```typescript
// AI 스트리밍 응답 생성
streamResponse(
  projectIdea: string,
  phase: Phase,
  stage: Stage
): AsyncGenerator<AIChunk>

// 프롬프트 구성
buildPrompt(projectIdea: string, phase: Phase, stage: Stage): string

// MVP 코드 생성
generateMVPCode(projectIdea: string): Promise<string>

// AWS 아키텍처 생성
generateAWSArchitecture(projectIdea: string): Promise<AWSArchitecture>
```

### LogService
```typescript
// 로그 저장
saveLog(log: DemoLog): Promise<void>

// 로그 조회
getLogs(filter?: LogFilter): Promise<DemoLog[]>

// 통계 조회
getStatistics(): Promise<LogStatistics>
```

### EstimateService
```typescript
// Production 예상 정보 계산
calculateEstimate(
  projectIdea: string,
  generatedContent: GeneratedContent
): Promise<ProductionEstimate>

// 복잡도 분석
analyzeComplexity(content: GeneratedContent): ComplexityScore

// 팀 구성 추천
recommendTeamComposition(complexity: ComplexityScore): TeamMember[]
```
