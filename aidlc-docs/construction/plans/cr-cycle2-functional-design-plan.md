# CR Cycle 2 - Functional Design Plan

## Unit: cr-cycle2 (변경요건 CR-01~CR-04)

---

## Plan Steps

### Part 1: 도메인 엔티티 설계

- [x] Step 1: ScenarioDefinition 확장 설계
  - 시나리오별 고유 채팅 대화 (chatSequence) 데이터 구조
  - 시나리오별 고유 파일명/파일 콘텐츠 데이터 구조
  - 시나리오별 고유 에디터 콘텐츠 데이터 구조
  - AI 보강 콘텐츠 인터페이스 (optional, fallback 포함)

- [x] Step 2: DemoSessionContext 확장 설계
  - scenarioId 필드 추가
  - scenarioId 기반 상태 관리 흐름

- [x] Step 3: Screen 3 탭별 시나리오 데이터 구조 설계
  - AWSArchitectureDiagram: 시나리오별 Mermaid 다이어그램 매핑
  - BusinessWorkflowDiagram: 시나리오별 시퀀스 다이어그램 매핑
  - EstimateService: 시나리오별 팀 구성/비용 산출 매핑
  - AIDLCOutputsTab: 시나리오별 산출물 콘텐츠 매핑
  - KiroIntroTab: 시나리오별 Kiro 활용 사례 매핑

### Part 2: 비즈니스 로직 설계

- [x] Step 4: 시나리오 End-to-End 전달 메커니즘 설계
  - Screen 1 -> 2: URL query param (`?idea=...&scenario=ecommerce`)
  - Screen 2 -> 3: URL query param 유지 + Context 전달
  - DemoSessionContext에서 scenarioId 관리
  - 새로고침/URL 공유 시 시나리오 유지 보장

- [x] Step 5: DemoStepGenerator 시나리오별 분기 로직 설계
  - generateDemoSteps(projectIdea, scenarioId) 시그니처 변경
  - scenarioId 기반 직접 시나리오 조회 (detectScenario 의존성 제거)
  - 시나리오별 고유 chatSequence, fileName, fileContent 생성

- [x] Step 6: 파일 탐색기 콘텐츠 연동 수정 로직 설계
  - handleFileClick: demoSteps 배열에서 fileName 매칭 -> fileContent 직접 표시
  - fileContentsMap 의존성 제거 또는 보조적 사용
  - 이전 단계 파일 클릭 시 정확한 콘텐츠 표시 보장

- [x] Step 7: MousePointer 시각적 개선 설계
  - 형태: 원형 (지름 40px)
  - 색상: 노란색 계열 (rgba(255, 215, 0, 0.3))
  - 효과: 펄스 애니메이션 (scale 1.0 -> 1.3 -> 1.0, 1.5초 주기)
  - 기존 SVG 커서 제거, 원형 div로 대체

### Part 3: 비즈니스 규칙 설계

- [x] Step 8: 시나리오 콘텐츠 비즈니스 규칙 정의
  - 8개 시나리오 + 1개 default 시나리오 콘텐츠 규칙
  - 시나리오 미감지 시 default fallback 규칙
  - 네트워크 실패 시 정적 콘텐츠 fallback 규칙

- [x] Step 9: Screen 3 탭별 시나리오 분기 규칙 정의
  - 각 탭 컴포넌트의 scenarioId 기반 분기 조건
  - 시나리오별 콘텐츠 일관성 규칙 (End-to-End)

---

## Questions

아래 질문에 답변해주세요. 각 질문의 [Answer]: 태그 뒤에 답변을 작성해주세요.

### Q1. 시나리오별 고유 채팅 대화 깊이

Screen 2에서 시나리오별 고유 채팅 대화를 어느 수준까지 차별화할까요?

A) 최소 차별화 - 각 단계의 첫 AI 메시지만 시나리오별로 다르게 (나머지는 공통)
B) 중간 차별화 - AI 메시지 전체를 시나리오별로 다르게, 사용자 응답은 공통
C) 완전 차별화 - AI 메시지 + 사용자 응답 + 시스템 메시지 모두 시나리오별 고유

[Answer]:b

### Q2. 시나리오별 생성 파일 구조

Screen 2에서 시나리오별로 생성되는 파일명과 파일 콘텐츠를 어떻게 구성할까요?

A) 파일명은 공통 (requirements.md 등), 콘텐츠만 시나리오별로 다르게
B) 파일명도 시나리오별로 다르게 (예: ecommerce-requirements.md)
C) 파일명은 공통이지만 내부 제목/도메인명이 시나리오별로 다르게

[Answer]:a

### Q3. Screen 3 AIDLCOutputsTab / KiroIntroTab 시나리오 분기 수준

현재 AIDLCOutputsTab은 하드코딩된 5개 산출물을 보여주고, KiroIntroTab은 Kiro 소개 정보를 보여줍니다. 시나리오별로 어떻게 차별화할까요?

A) AIDLCOutputsTab: 산출물 콘텐츠만 시나리오별로 다르게 / KiroIntroTab: 시나리오별 활용 사례 추가
B) AIDLCOutputsTab: 산출물 목록 자체도 시나리오별로 다르게 / KiroIntroTab: 시나리오별 완전 커스텀
C) 두 탭 모두 현재 구조 유지, 시나리오 정보만 제목에 표시

[Answer]: 너가 말하는 tab이 어떤걸뜻하는지모르겠어 3번째페이지에 6개탭이있지않아?

### Q4. MousePointer 기존 SVG 커서 처리

현재 MousePointer는 흰색 SVG 화살표 커서입니다. 노란색 원형으로 변경 시:

A) SVG 커서 완전 제거, 노란색 원형만 표시
B) SVG 커서 유지 + 노란색 원형 배경 추가 (커서 주변 하이라이트)
C) SVG 커서를 노란색으로 변경 + 원형 펄스 효과 추가

[Answer]:b

### Q5. 시나리오별 Estimate 데이터 차별화 방식

현재 EstimateService는 키워드 기반으로 복잡도를 분석합니다. 시나리오별로 어떻게 차별화할까요?

A) scenarioId 기반 고정 Estimate 데이터 (랜덤 요소 제거, 시나리오별 확정 값)
B) 기존 키워드 분석 유지 + scenarioId로 추가 보정 (기존 로직 확장)
C) scenarioId별 팀 구성/기간/비용 템플릿 정의 (완전 새 로직)

[Answer]:c

