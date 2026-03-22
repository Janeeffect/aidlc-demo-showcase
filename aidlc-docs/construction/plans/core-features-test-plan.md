# Test Plan - Unit 2: 핵심 기능

## Unit Overview
- **Unit**: core-features
- **Stories**: US-A01~A07, US-D01, US-D02
- **Requirements**: REQ-B01, REQ-B06

---

## 1. Animation Sequence 생성 Tests (`src/__tests__/AnimationSequence.test.ts`)

### buildAnimationSequence()

- **TC-CF-001**: 각 DemoStep에 AnimationSequence가 포함된다
  - Given: generateDemoSteps("온라인 쇼핑몰") 호출
  - When: 반환된 7개 DemoStep 확인
  - Then: 모든 step에 animationSequence 필드가 존재하고 steps 배열이 비어있지 않다
  - Story: US-A07
  - Status: Not Started

- **TC-CF-002**: AnimationSequence에 move step이 포함된다
  - Given: 생성된 AnimationSequence
  - When: steps에서 type='move' 필터링
  - Then: 최소 1개 이상의 move step이 존재한다
  - Story: US-A01
  - Status: Not Started

- **TC-CF-003**: AnimationSequence에 click step이 포함된다
  - Given: 생성된 AnimationSequence
  - When: steps에서 type='click' 필터링
  - Then: 최소 1개 이상의 click step이 존재한다
  - Story: US-A02, US-A04
  - Status: Not Started

- **TC-CF-004**: AnimationSequence에 type step이 포함된다
  - Given: 생성된 AnimationSequence
  - When: steps에서 type='type' 필터링
  - Then: 최소 1개 이상의 type step이 존재하고 content가 비어있지 않다
  - Story: US-A03
  - Status: Not Started

- **TC-CF-005**: AnimationSequence에 scroll step이 포함된다
  - Given: 생성된 AnimationSequence
  - When: steps에서 type='scroll' 필터링
  - Then: 최소 1개 이상의 scroll step이 존재한다
  - Story: US-A06
  - Status: Not Started

- **TC-CF-006**: AnimationSequence의 모든 step ID가 고유하다
  - Given: 생성된 7개 AnimationSequence의 모든 steps
  - When: 전체 step id 중복 확인
  - Then: 모든 id가 고유하다
  - Story: US-A07
  - Status: Not Started

- **TC-CF-007**: AnimationSequence의 모든 duration이 100ms 이상이다
  - Given: 생성된 AnimationSequence
  - When: 모든 step의 duration 확인
  - Then: 모든 duration >= 100
  - Story: US-A07
  - Status: Not Started

---

## 2. resolveTargetPosition Tests (`src/__tests__/AnimationSequence.test.ts`)

- **TC-CF-008**: DOM 요소가 없으면 fallback 좌표를 반환한다
  - Given: DOM에 data-animation-target 요소가 없음
  - When: resolveTargetPosition('chat-input') 호출
  - Then: FALLBACK_POSITIONS['chat-input'] 좌표 반환
  - Story: US-A01
  - Status: Not Started

- **TC-CF-009**: 알 수 없는 target은 기본 fallback을 반환한다
  - Given: 정의되지 않은 target 값
  - When: resolveTargetPosition('unknown-target') 호출
  - Then: 기본 좌표 { x: 500, y: 400 } 반환
  - Story: US-A01
  - Status: Not Started

---

## 3. API 에러 응답 통일 Tests (`src/__tests__/ApiErrorResponse.test.ts`)

- **TC-CF-010**: /api/demo/start 에러 응답이 통일 형식이다
  - Given: 빈 projectIdea로 POST 요청
  - When: 400 응답 수신
  - Then: { success: false, message: "프로젝트 아이디어를 입력해주세요" }
  - Story: US-D02
  - Status: Not Started

- **TC-CF-011**: /api/demo/send-report 에러 응답이 통일 형식이다
  - Given: 잘못된 요청 body로 POST
  - When: 500 응답 수신
  - Then: { success: false, message: string } 형식
  - Story: US-D02
  - Status: Not Started

- **TC-CF-012**: /api/log POST 에러 응답이 통일 형식이다
  - Given: 잘못된 요청 body로 POST
  - When: 500 응답 수신
  - Then: { success: false, message: "로그 기록에 실패했습니다" }
  - Story: US-D02
  - Status: Not Started

---

## 4. 이메일 에러 피드백 Tests (`src/__tests__/EmailErrorFeedback.test.tsx`)

- **TC-CF-013**: 이메일 전송 실패 시 에러 메시지가 표시된다
  - Given: fetch가 에러를 throw
  - When: 전송 버튼 클릭
  - Then: "전송에 실패했습니다. 다시 시도해주세요." 메시지 표시
  - Story: US-D01
  - Status: Not Started

- **TC-CF-014**: 재시도 시 에러 메시지가 사라진다
  - Given: 에러 메시지가 표시된 상태
  - When: 전송 버튼 다시 클릭 (이번엔 성공)
  - Then: 에러 메시지가 사라지고 성공 화면 표시
  - Story: US-D01
  - Status: Not Started

---

## 5. KiroIDELayout data-attribute Tests (`src/__tests__/KiroIDELayout.test.tsx`)

- **TC-CF-015**: KiroIDELayout에 data-animation-target 속성이 존재한다
  - Given: KiroIDELayout 렌더링
  - When: DOM에서 data-animation-target 속성 검색
  - Then: chat-input, editor-content 등 주요 target이 존재한다
  - Story: US-A02, US-A03
  - Status: Not Started

---

## 6. DemoPage Animation 통합 Tests (`src/__tests__/DemoPageAnimation.test.tsx`)

- **TC-CF-016**: DemoPage에 AnimationOrchestrator가 렌더링된다
  - Given: DemoPage 렌더링
  - When: 데모 진행 중
  - Then: MousePointer 컴포넌트가 DOM에 존재한다
  - Story: US-A01, US-A07
  - Status: Not Started

---

## Requirements Coverage

| Requirement ID | Test Cases | Status |
|---------------|------------|--------|
| REQ-B01 | TC-CF-001~009, TC-CF-015~016 | Pending |
| REQ-B06 | TC-CF-010~014 | Pending |

## Story Coverage

| Story ID | Test Cases | Status |
|----------|------------|--------|
| US-A01 | TC-CF-002, TC-CF-008, TC-CF-009, TC-CF-016 | Pending |
| US-A02 | TC-CF-003, TC-CF-015 | Pending |
| US-A03 | TC-CF-004, TC-CF-015 | Pending |
| US-A04 | TC-CF-003 | Pending |
| US-A05 | TC-CF-001 (탭 전환은 시퀀스에 포함) | Pending |
| US-A06 | TC-CF-005 | Pending |
| US-A07 | TC-CF-001, TC-CF-006, TC-CF-007, TC-CF-016 | Pending |
| US-D01 | TC-CF-013, TC-CF-014 | Pending |
| US-D02 | TC-CF-010, TC-CF-011, TC-CF-012 | Pending |
