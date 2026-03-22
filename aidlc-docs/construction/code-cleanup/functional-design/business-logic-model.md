# Business Logic Model - Unit 1: 코드 정리

## 1. ScenarioDetector 비즈니스 로직

### 1.1 목적
사용자 입력 텍스트를 분석하여 8개 산업 시나리오 중 최적의 시나리오를 반환한다.

### 1.2 매칭 알고리즘 (키워드 가중치 기반)

```
Input: idea (string)
Output: IndustryScenario

Algorithm:
1. idea를 소문자로 변환
2. 모든 시나리오의 keywords를 순회
3. 각 시나리오별 매칭 점수 계산:
   - 매칭된 키워드 수 x 1.0 (기본 가중치)
   - priority가 높은 키워드 매칭 시 x 1.5 (우선 가중치)
4. 최고 점수 시나리오 반환
5. 매칭 점수가 0인 경우 기본(범용) 시나리오 반환
6. 동점인 경우 priority가 높은 시나리오 우선
```

### 1.3 시나리오 데이터 구조 (단일 파일 관리)

```
src/data/scenarios.ts:
  - SCENARIOS: Record<string, ScenarioDefinition>
  - 8개 산업: ecommerce, fintech, healthcare, education, logistics, saas, chat, default
  - 각 시나리오: keywords[], priority, domain, userTypes, mainFeatures[], techStack, ...
```

### 1.4 데이터 흐름

```
[사용자 입력 텍스트]
       |
       v
[소문자 변환 + 정규화]
       |
       v
[전체 시나리오 키워드 스캔]
       |
       v
[시나리오별 매칭 점수 계산]
       |
       v
[최고 점수 시나리오 선택]
       |
       v
[IndustryScenario 반환]
```

---

## 2. DemoStepGenerator 비즈니스 로직

### 2.1 목적
detectScenario 결과를 기반으로 7개 데모 단계(DemoStep[])를 생성한다.

### 2.2 단계 생성 알고리즘

```
Input: projectIdea (string)
Output: DemoStep[] (7개)

Algorithm:
1. detectScenario(projectIdea) 호출 -> IndustryScenario 획득
2. 시나리오 데이터 기반 7개 단계 생성:
   - Step 0: 요구사항 분석 (INCEPTION/requirements)
   - Step 1: 사용자 스토리 (INCEPTION/design)
   - Step 2: 애플리케이션 설계 (INCEPTION/design)
   - Step 3: NFR 설계 (CONSTRUCTION/code)
   - Step 4: 코드 생성 (CONSTRUCTION/code)
   - Step 5: 인프라 설계 (OPERATIONS/infrastructure)
   - Step 6: 배포 계획 (OPERATIONS/deployment)
3. 각 단계별 생성 항목:
   - phase, stage, label (메타데이터)
   - fileName (생성될 파일 경로)
   - fileContent (파일 내용 - 시나리오 데이터 기반 템플릿 렌더링)
   - chatSequence (채팅 메시지 시퀀스)
```

### 2.3 chatSequence 생성 규칙

```
각 단계의 chatSequence 구성:
1. system 메시지: 단계 진입 안내
2. ai 메시지: 분석/생성 시작 안내 (시나리오 데이터 활용)
3. [선택] ai 메시지: 질문 (questions 데이터 활용)
4. [선택] user 메시지: 자동 답변 (questions.answer 활용)
5. ai 메시지: 결과 요약

메시지 ID: 순차 증가 (전체 단계 통틀어 고유)
```

### 2.4 fileContent 생성 규칙

```
각 단계의 fileContent:
- Markdown 템플릿 기반
- 시나리오 데이터 (domain, userTypes, mainFeatures, techStack 등) 삽입
- 테이블, 목록, 코드 블록 등 구조화된 형식
- 한국어 기본
```

---

## 3. useDemoProgress Hook 비즈니스 로직

### 3.1 목적
데모 진행 상태를 관리하는 순수 상태 관리 훅.

### 3.2 상태 모델

```
State:
  - currentStep: number (0-based index, 초기값 0)
  - isAnimating: boolean (단계 실행 중 여부, 초기값 false)
  - stepCompleted: boolean (현재 단계 완료 여부, 초기값 false)

Derived:
  - progress: number (0~100, = round((currentStep + 1) / totalSteps * 100))
  - isLastStep: boolean (currentStep >= totalSteps - 1)
  - canGoNext: boolean (!isAnimating && stepCompleted)
  - canGoPrev: boolean (currentStep > 0 && !isAnimating)
```

### 3.3 액션

```
handleNextStep():
  - Guard: canGoNext가 false면 무시
  - isLastStep이면 결과 페이지로 라우팅 (콜백 호출)
  - 아니면 currentStep + 1, stepCompleted = false

handlePrevStep():
  - Guard: canGoPrev가 false면 무시
  - currentStep - 1, stepCompleted = false

setIsAnimating(v): isAnimating = v
setStepCompleted(v): stepCompleted = v
reset(): 모든 상태 초기값으로
```

---

## 4. useRunStep Hook 비즈니스 로직

### 4.1 목적
단일 데모 단계의 비동기 실행 로직을 관리한다. 채팅 메시지 시뮬레이션, 파일 생성, 진행률 업데이트를 순차적으로 수행.

### 4.2 실행 알고리즘

```
Input: stepIdx (number), demoSteps (DemoStep[])
Output: void (side effects via callbacks)

Algorithm:
1. runId 증가 (취소 메커니즘)
2. isAnimating = true, stepCompleted = false
3. 이전 단계들의 chatSequence를 모아서 chatMessages 초기화
4. phase/stage 업데이트 (콜백)
5. 현재 단계의 chatSequence를 순차 처리:
   - ai 메시지: isTyping=true -> 800ms 대기 -> isTyping=false -> 메시지 추가
   - user 메시지: 400ms 대기 -> 메시지 추가
   - system 메시지: 200ms 대기 -> 메시지 추가
   - 각 단계에서 cancelled() 체크 (runId 비교)
6. 500ms 대기 후 파일 생성 (addFile 콜백)
7. activeFile, editorContent 업데이트 (콜백)
8. progress 업데이트 (콜백)
9. 완료 안내 system 메시지 추가
10. isAnimating = false, stepCompleted = true
```

### 4.3 취소 메커니즘

```
- runIdRef: useRef<number>(0)
- 새 runStep 호출 시 runIdRef.current++ 
- 각 await 후 cancelled() = (runIdRef.current !== myRunId) 체크
- cancelled()가 true면 즉시 return (cleanup 불필요)
- 이전 실행이 자연스럽게 중단됨
```

### 4.4 콜백 인터페이스

```
callbacks:
  onChatMessage(msg): 채팅 메시지 추가
  onChatReset(messages): 채팅 메시지 전체 교체 (이전 단계 복원)
  onFileAdd(file): 파일 트리에 파일 추가
  onEditorContent(content): 에디터 내용 업데이트
  onActiveFile(path): 활성 파일 변경
  onPhaseChange(phase, stage): 현재 phase/stage 업데이트
  onProgress(progress): 진행률 업데이트
  onStepComplete(): 단계 완료 알림
  onAnimatingChange(v): 애니메이션 상태 변경
  onTypingChange(v): 타이핑 상태 변경
```

---

## 5. LogService 연동 비즈니스 로직

### 5.1 호출 시점

```
StartPage (시작 버튼 클릭 시):
  - logService.logStart(sessionId, projectIdea)
  - Fire-and-forget (await 없이 호출, .catch로 에러 무시)

ResultPage (페이지 진입 시):
  - logService.logComplete(sessionId, projectIdea, durationMs)
  - Fire-and-forget (await 없이 호출, .catch로 에러 무시)
```

### 5.2 Fire-and-forget 패턴 (네트워크 불안정 대응)

```
// 로그 실패가 데모 진행을 절대 방해하지 않음
logService.logStart(sessionId, idea).catch(() => {
  // 무시 - Summit 현장 네트워크 불안정 대응
});
```

### 5.3 근거
- AWS Summit 현장은 수천 명이 동시 접속하여 네트워크가 불안정
- 로그는 부가 기능이며, 데모 진행이 최우선
- 로그 실패로 인한 에러 팝업이나 지연은 부스 방문객 경험을 해침
- 관리자 대시보드 데이터는 "최선 노력(best-effort)" 수준으로 충분

---

## 6. 미사용 코드 삭제 로직

### 6.1 삭제 대상

```
파일 삭제:
  - src/app/api/demo/stream/route.ts (미사용 SSE 스트리밍 API)
  - src/app/api/demo/estimate/route.ts (미사용 - EstimateService가 클라이언트 사이드)
  - src/services/AIService.ts (미사용 - 향후 LLM 연동 시 재생성)

테스트 처리:
  - 삭제 대상 파일을 참조하는 테스트가 있으면 함께 삭제
  - 신규 모듈 테스트는 Code Generation 단계에서 작성
```

### 6.2 삭제 전 검증

```
삭제 전 확인 사항:
1. 다른 파일에서 import하고 있지 않은지 확인
2. 테스트 파일에서 참조하고 있지 않은지 확인
3. 삭제 후 빌드 성공 확인
```

---

## 7. DemoPage 축소 후 구조

### 7.1 리팩토링 후 DemoPage 책임 (200 라인 이하)

```
DemoPage 역할 (조합만 담당):
1. URL 파라미터에서 projectIdea 추출
2. useDemoProgress() 훅으로 상태 관리
3. useMemo로 demoSteps 생성 (DemoStepGenerator 호출)
4. useRunStep() 훅으로 단계 실행
5. KiroIDELayout 렌더링 (props 전달)
6. 상단 네비게이션 바 렌더링 (이전/다음 버튼)
7. Suspense 래핑
```

### 7.2 모듈 의존성 (계층 구조)

```
DemoPage
  |-- useDemoProgress (상태 관리)
  |-- useRunStep (실행 로직)
  |     |-- DemoStepGenerator
  |     |     |-- ScenarioDetector
  |     |     |     |-- scenarios (데이터)
  |     |-- delay (유틸)
  |-- KiroIDELayout (UI)
  |-- DemoSessionContext (전역 상태)
```
