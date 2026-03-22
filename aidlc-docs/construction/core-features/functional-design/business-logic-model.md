# Business Logic Model - Unit 2: 핵심 기능

## 1. Animation Orchestration 로직

### 1.1 AnimationSequence 생성 (demoStepGenerator 확장)

`generateDemoSteps()` 함수가 각 DemoStep에 `animationSequence: AnimationSequence` 필드를 추가 생성한다.

각 단계의 Animation 시퀀스 패턴:

```
단계 시작
  -> 마우스가 채팅 입력창으로 이동 (move)
  -> 사용자 메시지 타이핑 시뮬레이션 (type)
  -> 전송 버튼 클릭 (click)
  -> AI 응답 대기 (wait)
  -> [Q&A 반복 시 위 패턴 반복]
  -> 마우스가 파일 탐색기로 이동 (move)
  -> 파일 클릭 (click + createFile)
  -> 에디터 영역에서 콘텐츠 스크롤 (scroll)
  -> 완료 대기 (wait)
단계 종료
```

### 1.2 좌표 계산 (data-attribute 기반)

대상 요소에 `data-animation-target` 속성을 부여:
- `data-animation-target="chat-input"` - 채팅 입력창
- `data-animation-target="send-button"` - 전송 버튼
- `data-animation-target="file-{path}"` - 파일 탐색기 항목
- `data-animation-target="editor-tab"` - 에디터 탭
- `data-animation-target="editor-content"` - 에디터 콘텐츠 영역
- `data-animation-target="next-button"` - 다음 단계 버튼
- `data-animation-target="result-button"` - 결과 보기 버튼

AnimationOrchestrator가 step 실행 시 `document.querySelector('[data-animation-target="..."]')`로 요소를 찾고, `getBoundingClientRect()`로 좌표를 계산한다.

요소를 찾지 못하면 fallback 고정 좌표를 사용한다.

### 1.3 AnimationOrchestrator 통합 흐름

```
DemoPage
  ├── useRunStep (데이터 흐름 관리)
  │     └── 콜백으로 상태 업데이트 (채팅, 파일, 에디터)
  ├── AnimationOrchestrator (시각적 Animation 실행)
  │     ├── MousePointer (마우스 포인터 렌더링)
  │     └── 각 step type별 실행 로직
  └── KiroIDELayout (UI 렌더링)
        └── data-animation-target 속성 보유
```

useRunStep이 단계 실행 시:
1. 해당 단계의 animationSequence를 AnimationOrchestrator에 전달
2. AnimationOrchestrator가 시퀀스를 순차 실행
3. 각 Animation step 완료 시 onStepComplete 콜백으로 실제 데이터 변경 트리거
4. 모든 Animation 완료 시 onAllComplete로 단계 완료 처리

### 1.4 Animation Step Type별 동작

| Step Type | 동작 | 시각적 효과 |
|-----------|------|-------------|
| move | 마우스 포인터를 target 위치로 이동 | spring 애니메이션 이동 |
| click | target 요소 클릭 시뮬레이션 | 클릭 ripple 효과 + scale 0.9 |
| type | 채팅 입력창에 텍스트 타이핑 | 글자 단위 타이핑 애니메이션 |
| wait | 지정 시간 대기 | 없음 (AI 응답 대기 등) |
| createFile | 파일 탐색기에 파일 추가 | 파일 항목 fade-in + 하이라이트 |
| openFile | 에디터에 파일 열기 | 탭 추가 + 콘텐츠 표시 |
| scroll | 에디터 콘텐츠 스크롤 | 부드러운 스크롤 애니메이션 |

---

## 2. 에러 핸들링 통일 로직

### 2.1 API 에러 응답 통일

모든 API Route의 에러 응답을 통일 형식으로 변경:

```typescript
// 성공 응답 (기존 유지)
{ success: true, ...data }

// 에러 응답 (통일)
{ success: false, message: string }
```

적용 대상:
- `/api/demo/start` - 400: "프로젝트 아이디어를 입력해주세요", 500: "데모 시작에 실패했습니다"
- `/api/demo/send-report` - 500: "리포트 전송에 실패했습니다"
- `/api/log` - 500: "로그 기록에 실패했습니다" / "로그 조회에 실패했습니다"

### 2.2 이메일 전송 실패 피드백

ResultPage의 EmailReportModal에서:
1. fetch 실패 또는 `success: false` 응답 시
2. 모달 내 전송 버튼 아래에 에러 메시지 표시 (빨간 텍스트)
3. 에러 상태: `errorMessage` state 추가
4. 에러 메시지: "전송에 실패했습니다. 다시 시도해주세요."
5. 재시도 가능 (버튼 다시 클릭)

---

## 3. 모듈 의존성

```
DemoPage (조합 레이어)
  ├── useDemoProgress (상태 관리) [Unit 1 완료]
  ├── useRunStep (실행 로직) [Unit 1 완료, Unit 2에서 Animation 콜백 추가]
  ├── AnimationOrchestrator (Animation 실행) [Unit 2 수정]
  │     ├── MousePointer [Unit 2 수정 - data-attribute 좌표]
  │     └── TypingEffect [기존 유지]
  ├── KiroIDELayout (UI) [Unit 2 수정 - data-animation-target 추가]
  └── demoStepGenerator [Unit 2 수정 - animationSequence 생성]

ResultPage
  └── EmailReportModal [Unit 2 수정 - 에러 피드백 추가]

API Routes
  ├── /api/demo/start [Unit 2 수정 - 에러 응답 통일]
  ├── /api/demo/send-report [Unit 2 수정 - 에러 응답 통일]
  └── /api/log [Unit 2 수정 - 에러 응답 통일]
```
