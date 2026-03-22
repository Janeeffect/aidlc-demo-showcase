# CR Cycle 3 - Business Rules

## BR-05: 파일 탐색기 콘텐츠 매핑 규칙

### BR-05-01: 파일 클릭 시 콘텐츠 로딩 우선순위
1. `fileContentsMap[path]`에 non-empty 값이 있으면 해당 콘텐츠 표시
2. `demoSteps.find(step => step.fileName === path)` 매칭 시 `fileContent` 표시
3. 둘 다 없으면 빈 상태 유지

### BR-05-02: 파일 추가 시 콘텐츠 저장 규칙
- `onFileAdd` 콜백 실행 시 해당 step의 `fileContent`를 `fileContentsMap`에 즉시 저장
- 빈 문자열('')이 아닌 실제 콘텐츠를 저장해야 함

### BR-05-03: 파일-콘텐츠 1:1 매핑 보장
- 각 파일 path는 고유한 콘텐츠와 매핑
- 동일 path에 대해 콘텐츠가 덮어쓰기되지 않도록 보호

---

## BR-06: MousePointer 삭제 규칙

### BR-06-01: 완전 삭제 원칙
- MousePointer.tsx 컴포넌트 파일 삭제
- 관련 테스트 파일 삭제
- import 문 및 사용처 모두 제거
- 미사용 타입/인터페이스 정리

### BR-06-02: 회귀 방지
- MousePointer 삭제 후 기존 테스트 전체 통과 확인
- demo/page.tsx 정상 동작 확인

---

## BR-07: 채팅 대화 깊이 규칙

### BR-07-01: 최소 메시지 수
- 각 단계(step)별 최소 8개 메시지
- system 메시지 1개 + ai/user 메시지 7개 이상

### BR-07-02: 대화 패턴 규칙
- 질문-확인-반영의 다회전 대화 구조 필수
- 단순 "~하겠습니다" 응답 금지
- 엣지케이스 논의, 기술 스택 선정 근거, 트레이드오프 검토 포함

### BR-07-03: 하이브리드 생성 규칙
- 템플릿 부분: 시나리오 데이터(domain, userTypes, mainFeatures, techStack)를 변수로 삽입
- 하드코딩 부분: 핵심 질문-답변 구간은 시나리오별 고유 문장 유지
- 두 방식의 자연스러운 연결 필수

### BR-07-04: 콘텐츠 품질 기준
- Product-Ready 수준: 실제 AI-DLC를 수행하는 것처럼 깊이 있는 대화
- 요구사항 구체화, 엣지케이스 논의, 기술 스택 선정 근거 포함
- 각 메시지는 최소 2줄 이상의 의미 있는 내용

---

## BR-08: 결과 화면 품질 규칙

### BR-08-01: 전체 6개 탭 강화 대상
- MVP Preview, AWS Architecture, Business Workflow, Estimate, AI-DLC Outputs, Kiro Intro

### BR-08-02: Product-Ready 기준
- AWS 아키텍처: 보안, 스케일링, 모니터링, 비용 최적화 포함
- 비즈니스 로직: 예외 처리, 유효성 검증, 에러 핸들링 포함
- Estimate: 상세 비용 분석, 리스크 요소 포함
- AI-DLC 산출물: 시나리오별 분기, 실제 구현 가능한 수준
- Kiro 소개: 시나리오별 활용 사례
- MVP Preview: scenarioId 기반 분기

### BR-08-03: 시나리오별 분기 규칙
- scenarioId가 있으면 해당 시나리오 콘텐츠 표시
- scenarioId가 없으면 키워드 기반 fallback
- 모든 시나리오에 대해 고유한 콘텐츠 제공

---

## BR-09: 안내 문구 규칙

### BR-09-01: 버튼 위치 안내 정확성
- 실제 버튼 위치와 안내 문구 일치 필수
- "다음 단계" 버튼: 우측 상단
- "결과 보기" 버튼: 우측 상단

---

## BR-10: 성능 최적화 규칙

### BR-10-01: 폰트 로딩 최적화
- Google Fonts 외부 의존성 제거
- next/font/local 사용하여 로컬 폰트 로드
- Summit 현장 네트워크 불안정 대비

### BR-10-02: 번들 최적화
- framer-motion: 첫 페이지에서 필수 아닌 애니메이션 제거 또는 CSS 대체
- dynamic import 활용하여 초기 번들 사이즈 축소

### BR-10-03: 이미지 최적화
- next/image priority 속성 활용
- 적절한 사이즈 및 포맷 사용
