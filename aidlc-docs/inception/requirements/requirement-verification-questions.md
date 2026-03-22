# AI-DLC Demo Showcase 브라운필드 요구사항 검증 질문

Reverse Engineering 결과를 기반으로, 현재 구현과 원래 요구사항 간의 갭 및 개선 방향을 확인합니다.
각 질문의 [Answer]: 태그 뒤에 선택한 옵션 문자를 입력해주세요.

---

## Question 1: Animation 컴포넌트 처리 방향
원래 요구사항에는 "마우스 포인터 애니메이션"이 포함되어 있었으나, 현재 구현에서는 `src/components/animation/` 디렉토리의 3개 파일(AnimationOrchestrator, MousePointer, TypingEffect)이 어디서도 import되지 않고 미사용 상태입니다. 현재 DemoPage는 채팅 기반 시뮬레이션으로 대체 구현되었습니다.

A) 삭제 - 미사용 Animation 컴포넌트 3개를 제거하여 코드 정리
B) 활용 - 원래 요구사항대로 마우스 포인터 애니메이션을 DemoPage에 통합
C) 유지 - 현재 상태 유지 (향후 확장 가능성을 위해 코드만 보존)
X) Other (please describe after [Answer]: tag below)

[Answer]: b

---

## Question 2: 미사용 API Route 처리 방향
RE 결과, 다음 API Route들이 실제로 호출되지 않고 있습니다:
- `GET /api/demo/stream` - DemoPage가 클라이언트 사이드에서 직접 콘텐츠 생성
- `POST /api/demo/estimate` - ResultPage가 클라이언트 사이드 EstimateService 사용
- `POST/GET /api/log` - LogService 존재하나 호출 코드 없음

A) 삭제 - 미사용 API Route 3개를 제거하여 코드 정리
B) 활용 - 실제 서버 사이드 처리로 전환하여 API Route 활용
C) 부분 활용 - log API만 실제 연동하고 나머지는 삭제
D) 유지 - 현재 상태 유지 (향후 실제 AI/서버 연동 시 활용)
X) Other (please describe after [Answer]: tag below)

[Answer]: 너의 제안은뭐야?

---

## Question 3: DemoPage 리팩토링 범위
현재 `src/app/demo/page.tsx`가 500+ 라인으로, detectScenario, generateDemoSteps, runStep 등 핵심 로직이 모두 한 파일에 있습니다 (God Component 안티패턴).

A) 전면 리팩토링 - detectScenario, generateDemoSteps를 별도 모듈로 분리, 커스텀 훅 추출
B) 부분 리팩토링 - detectScenario와 시나리오 데이터만 별도 파일로 분리
C) 유지 - 현재 동작에 문제 없으므로 리팩토링 불필요
X) Other (please describe after [Answer]: tag below)

[Answer]:a

---

## Question 4: 접근성(Accessibility) 개선 범위
RE 코드 품질 평가에서 접근성 미흡 사항이 발견되었습니다:
- aria-label, aria-live, role 속성 미사용
- 키보드 전용 네비게이션 미지원 (파일 탐색기, 탭)
- 색상 대비 WCAG AA 기준 미달 가능성

AWS Summit 부스 환경을 고려할 때:

A) 최소 개선 - aria-label 추가, 색상 대비 수정 등 기본적인 접근성만 개선
B) 표준 개선 - 키보드 네비게이션, 스크린 리더 지원, 포커스 관리까지 포함
C) 불필요 - 부스 전용 데모이므로 접근성 개선 불필요
X) Other (please describe after [Answer]: tag below)

[Answer]:b

---

## Question 5: 이메일 리포트 기능 구현 수준
현재 `POST /api/demo/send-report`는 콘솔 로그만 기록하고 실제 이메일 전송은 미구현입니다.

A) 실제 구현 - AWS SES 등을 연동하여 실제 이메일 전송
B) 모의 구현 유지 - 현재처럼 성공 응답만 반환 (데모 목적에 충분)
C) 제거 - 이메일 기능 자체를 제거하고 QR 코드만 유지
X) Other (please describe after [Answer]: tag below)

[Answer]:b

---

## Question 6: 에러 핸들링 개선 범위
RE에서 발견된 에러 핸들링 미흡 사항:
- 이메일 전송 실패 시 사용자 피드백 없음
- API 에러 응답 형식 불일치
- 네트워크 오프라인 감지 없음

A) 전면 개선 - 모든 에러 핸들링 통일, 사용자 피드백 UI, 오프라인 감지 추가
B) 부분 개선 - 사용자에게 보이는 에러 메시지만 개선 (이메일 실패 알림 등)
C) 유지 - 부스 환경에서 안정적 네트워크 가정, 현재 수준 유지
X) Other (please describe after [Answer]: tag below)

[Answer]:AWS SES등을 사용하여 실제 이메일이 나가는것 까지는 지금은 구현 안할거야. 나중엔 할거지만. 그러면 뭘선택해야해. 제안해줘

---

## Question 7: 성능 최적화 범위
RE에서 발견된 성능 우려 사항:
- mermaid 라이브러리 번들 크기 (동적 import로 완화했으나 첫 로드 지연 가능)
- MVPPreview.tsx 600+ 라인 (코드 스플리팅 불가)
- PhaseIndicator 메모이제이션 없음
- kiro.jpg에 Next.js Image 컴포넌트 미사용

A) 전면 최적화 - 번들 분석, 코드 스플리팅, 메모이제이션, Image 컴포넌트 적용
B) 부분 최적화 - Image 컴포넌트 적용, PhaseIndicator 메모이제이션 정도만
C) 유지 - 부스 환경에서 충분한 성능, 최적화 불필요
X) Other (please describe after [Answer]: tag below)

[Answer]:a

---

## Question 8: 추가 기능 요구사항
현재 구현에 없는 기능 중 추가하고 싶은 것이 있나요?

A) 관리자 대시보드 - 데모 통계, 방문객 입력 분석 화면
B) 다국어 지원 - 영어/한국어 전환
C) 데모 리플레이 - 완료된 데모를 다시 재생하는 기능
D) 추가 기능 없음 - 현재 기능 세트로 충분
X) Other (please describe after [Answer]: tag below)

[Answer]:a,b

---
