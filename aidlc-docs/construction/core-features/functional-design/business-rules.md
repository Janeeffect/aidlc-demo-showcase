# Business Rules - Unit 2: 핵심 기능

## BR-CF-01: Animation 시퀀스 생성 규칙

- 모든 DemoStep은 반드시 하나의 AnimationSequence를 가진다
- AnimationSequence의 steps 배열은 최소 3개 이상의 AnimationStep을 포함한다
- 각 AnimationStep의 duration은 100ms 이상이어야 한다
- move step의 target은 유효한 data-animation-target 값이어야 한다
- type step의 content는 빈 문자열이 아니어야 한다

## BR-CF-02: 마우스 포인터 좌표 계산 규칙

- data-animation-target 속성으로 대상 요소를 찾는다
- 요소를 찾으면 getBoundingClientRect()로 중앙 좌표를 계산한다
- 요소를 찾지 못하면 fallback 고정 좌표를 사용한다:
  - chat-input: { x: 컨테이너 우측 25%, y: 하단 80% }
  - file-explorer: { x: 좌측 10%, y: 중앙 50% }
  - editor: { x: 중앙 50%, y: 중앙 50% }
- 좌표는 viewport 기준 절대 좌표로 변환한다

## BR-CF-03: Animation 실행 순서 규칙

- Animation step은 반드시 순차적으로 실행된다 (병렬 실행 불가)
- 이전 step이 완료되어야 다음 step이 시작된다
- 단계 전환 시 현재 Animation은 즉시 취소된다
- 취소된 Animation의 콜백은 호출되지 않는다

## BR-CF-04: Animation과 데이터 동기화 규칙

- Animation step 완료 시 해당하는 데이터 변경이 트리거된다:
  - click (file) -> onFileAdd, onActiveFile, onEditorContent
  - type (chat) -> onChatMessage
  - createFile -> onFileAdd
- Animation이 취소되면 해당 데이터 변경도 취소된다
- Animation 없이 데이터만 변경하는 것은 허용되지 않는다 (데모 체험 목적)

## BR-CF-05: 에러 응답 통일 규칙

- 모든 API Route의 에러 응답은 `{ success: false, message: string }` 형식이다
- HTTP 상태 코드는 기존 유지 (400, 500)
- message는 한국어로 작성한다
- 서버 내부 에러 상세는 console.error로만 기록하고 클라이언트에 노출하지 않는다

## BR-CF-06: 이메일 에러 피드백 규칙

- fetch 실패 또는 response.ok === false 시 에러 메시지를 표시한다
- 에러 메시지는 모달 내 전송 버튼 아래에 인라인으로 표시한다
- 에러 메시지 색상: 빨간색 (#ef4444)
- 에러 발생 후 재시도가 가능해야 한다 (버튼 비활성화하지 않음)
- 재시도 시 이전 에러 메시지는 자동으로 사라진다

## BR-CF-07: Animation Speed 규칙

- 기본 speed는 1.0 (정상 속도)
- speed 값에 따라 모든 duration이 비례 조정된다 (duration / speed)
- speed 범위: 0.5 (느림) ~ 2.0 (빠름)
- Summit 데모 환경에서는 speed 1.0 사용 권장
