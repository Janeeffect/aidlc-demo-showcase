# Functional Design Plan - Unit 3: 품질 개선 (Quality Improvement)

## Unit Context
- **Stories**: US-C01~C06 (접근성), US-E01~E05 (성능)
- **Requirements**: REQ-B04 (접근성 표준 개선), REQ-B07 (전면 성능 최적화)
- **Dependencies**: Unit 1 완료 (리팩토링된 컴포넌트 구조)

---

## Plan Steps

- [x] Step 1: Unit 컨텍스트 분석 및 현재 코드 접근성/성능 감사
- [x] Step 2: 질문 수집 및 사용자 답변
- [x] Step 3: Functional Design 아티팩트 생성
  - [x] 3.1: business-logic-model.md (접근성 + 성능 로직 모델)
  - [x] 3.2: business-rules.md (접근성/성능 규칙)
  - [x] 3.3: domain-entities.md (엔티티 정의)
- [x] Step 4: 승인 요청 - APPROVED (2026-03-22)

---

## Questions

Unit 3의 범위와 우선순위를 확정하기 위해 아래 질문에 답변해주세요.

### Q1. MVPPreview 코드 스플리팅 전략
현재 MVPPreview.tsx가 616줄로 5개 산업별 MVP가 모두 한 파일에 있습니다. 분리 방식을 선택해주세요.

A) React.lazy + dynamic import로 산업별 파일 분리 (EcommerceMVP.tsx, BookingMVP.tsx 등 5개 파일)
B) 현재 파일 유지하되 Next.js dynamic()으로 MVPPreview 자체를 lazy load
C) A + B 모두 적용 (산업별 분리 + 전체 lazy load)

[Answer]:추천해줘

### Q2. 키보드 네비게이션 범위
키보드만으로 전체 데모 플로우를 진행할 수 있어야 합니다. 우선순위를 선택해주세요.

A) 시작 페이지 + 결과 페이지 탭만 (핵심 사용자 경로)
B) A + 파일 탐색기 키보드 네비게이션 (Arrow Up/Down, Enter)
C) B + 데모 페이지 단계 전환 키보드 단축키 (좌/우 화살표)

[Answer]:a

### Q3. 색상 대비 개선 범위
현재 다크 테마에서 일부 텍스트 색상이 WCAG AA 기준(4.5:1)에 미달합니다. 개선 범위를 선택해주세요.

A) 핵심 텍스트만 (본문, 버튼, 라벨) - 최소 변경
B) A + 보조 텍스트 (#8888a0 등 회색 계열) - 중간 변경
C) B + 포커스 링 스타일 추가 - 전면 개선

[Answer]:c

### Q4. PhaseIndicator 메모이제이션 수준
PhaseIndicator가 매 렌더링마다 phaseConfigs 배열을 재생성합니다. 최적화 수준을 선택해주세요.

A) useMemo로 phaseConfigs만 메모이제이션
B) A + React.memo로 PhaseIndicator 전체 메모이제이션
C) B + 내부 계산 함수들도 useMemo/useCallback 적용

[Answer]:추천해줘

### Q5. 이미지 최적화 (kiro.jpg)
현재 KiroIDELayout과 ChatBubble에서 `<img>` 태그로 kiro.jpg를 직접 사용합니다.

A) Next.js Image 컴포넌트로 교체 (자동 최적화, WebP 변환)
B) 현재 유지 (데모용이라 이미지 최적화 불필요)

[Answer]:a

### Q6. bundle-analyzer 설정
번들 분석 도구를 설정하여 번들 크기를 모니터링합니다.

A) @next/bundle-analyzer 설치 + next.config.js 설정만
B) A + 분석 결과 기반 추가 최적화 (불필요한 의존성 제거 등)

[Answer]:추천해줘
