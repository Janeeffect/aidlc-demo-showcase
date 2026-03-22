# Functional Design Plan - Unit 2: 핵심 기능 (Core Features)

## Unit Context
- **Unit**: core-features
- **Stories**: US-A01~A07, US-D01, US-D02 (9개)
- **Requirements**: REQ-B01 (Animation 통합), REQ-B06 (에러 핸들링)
- **Dependencies**: Unit 1 완료 (리팩토링된 DemoPage, useRunStep 훅)

---

## Plan Steps

- [x] Step 1: Unit 2 컨텍스트 분석 (unit-of-work.md, story-map, 기존 Animation 컴포넌트)
- [x] Step 2: 질문 수집 및 사용자 답변 대기
- [x] Step 3: 답변 분석 및 모호성 해소
- [x] Step 4: business-logic-model.md 생성
- [x] Step 5: business-rules.md 생성
- [x] Step 6: domain-entities.md 생성

---

## Questions

### Q1. Animation 시퀀스 복잡도
현재 AnimationOrchestrator는 move, click, type, wait, createFile, openFile, scroll 7가지 step type을 지원합니다.
데모 단계별 Animation 시퀀스를 어느 수준으로 구현할까요?

A) 기본 (마우스 이동 + 클릭만) - 파일 탐색기 클릭, 버튼 클릭 시뮬레이션
B) 중간 (마우스 + 클릭 + 타이핑) - A + 채팅 입력 타이핑 시뮬레이션 추가
C) 풀 (모든 step type 활용) - B + 탭 전환, 스크롤 시뮬레이션까지 포함

[Answer]: c

### Q2. Animation 시퀀스 생성 위치
Animation 시퀀스 데이터를 어디서 생성할까요?

A) demoStepGenerator에서 DemoStep과 함께 생성 - 각 단계에 animationSequence 필드 추가
B) 별도 animationSequenceGenerator 모듈 생성 - DemoStep을 입력받아 AnimationSequence 반환
C) scenarios.ts 데이터에 포함 - 시나리오별 고정 Animation 시퀀스 정의

[Answer]: 추천해줘

### Q3. 마우스 포인터 좌표 계산 방식
마우스 포인터가 파일 탐색기, 채팅 입력창, 버튼 등으로 이동할 때 좌표를 어떻게 결정할까요?

A) 고정 좌표 (하드코딩) - 레이아웃이 고정이므로 미리 정의된 좌표 사용
B) data-attribute 기반 동적 계산 - 대상 요소에 data-animation-target 속성 추가, DOM에서 위치 계산
C) 상대 좌표 (비율 기반) - 컨테이너 대비 % 좌표로 정의, 화면 크기 변화에 대응

[Answer]:추천해줘, 레이아웃 바뀔수도있어

### Q4. 에러 응답 통일 형식
API 에러 응답을 어떤 형식으로 통일할까요?

A) 최소 형식: `{ success: false, message: string }`
B) 상세 형식: `{ success: false, message: string, error?: string, code?: string }`
C) HTTP 표준 형식: `{ status: number, title: string, detail: string, type?: string }`

[Answer]:추천해줘

### Q5. 이메일 전송 실패 피드백 UI
이메일 전송 실패 시 사용자에게 어떻게 알릴까요?

A) 모달 내 인라인 에러 메시지 - 전송 버튼 아래에 빨간 텍스트 표시
B) Toast 알림 - 화면 상단/하단에 일시적 알림 표시 (3초 후 자동 사라짐)
C) 모달 상태 변경 - 모달 내용을 에러 상태로 변경, 재시도 버튼 제공

[Answer]: a

### Q6. Animation과 useRunStep 통합 방식
기존 useRunStep 훅에 Animation을 어떻게 통합할까요?

A) useRunStep 내부에 Animation 로직 추가 - 기존 콜백 시퀀스에 Animation step 삽입
B) useRunStep과 별도 useAnimation 훅 조합 - DemoPage에서 두 훅을 조합하여 사용
C) AnimationOrchestrator 컴포넌트에 위임 - useRunStep이 시퀀스를 전달하고, Orchestrator가 실행

[Answer]:추천해줘
