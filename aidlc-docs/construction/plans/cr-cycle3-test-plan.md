# Test Plan for CR Cycle 3

## Unit Overview
- **CRs**: CR-05~CR-10
- **Requirements**: CR-REQ-06~CR-REQ-11

---

## CR-05: 파일 탐색기 콘텐츠 연동

### handleFileClick 로직
- **TC-C3-001**: 파일 클릭 시 해당 파일의 고유 콘텐츠 표시
  - Given: demoSteps에 3개 파일(A, B, C)이 있고 각각 다른 fileContent를 가짐
  - When: 파일 A를 클릭
  - Then: 에디터에 파일 A의 fileContent가 표시됨
  - Requirement: CR-REQ-06
  - Status: Not Started

- **TC-C3-002**: 다른 파일 클릭 시 콘텐츠 전환
  - Given: 파일 A가 선택된 상태
  - When: 파일 B를 클릭
  - Then: 에디터에 파일 B의 fileContent가 표시됨
  - Requirement: CR-REQ-06
  - Status: Not Started

- **TC-C3-003**: onFileAdd 시 fileContent 저장
  - Given: useRunStep이 step을 실행
  - When: onFileAdd 콜백 호출
  - Then: fileContentsMap에 해당 step의 fileContent가 저장됨
  - Requirement: CR-REQ-06
  - Status: Not Started

---

## CR-06: MousePointer 삭제

- **TC-C3-004**: MousePointer 컴포넌트 파일 미존재 확인
  - Given: CR-06 적용 후
  - When: MousePointer.tsx import 시도
  - Then: 파일이 존재하지 않음 (삭제 확인)
  - Requirement: CR-REQ-07
  - Status: Not Started

- **TC-C3-005**: demo/page.tsx에서 MousePointer 미사용 확인
  - Given: CR-06 적용 후
  - When: demo/page.tsx 렌더링
  - Then: MousePointer 관련 요소 없음
  - Requirement: CR-REQ-07
  - Status: Not Started

---

## CR-07: 채팅 대화 깊이 강화

- **TC-C3-006**: 각 단계별 최소 8개 메시지
  - Given: generateDemoSteps 호출
  - When: 각 step의 chatSequence 확인
  - Then: 모든 step의 chatSequence.length >= 8
  - Requirement: CR-REQ-08
  - Status: Not Started

- **TC-C3-007**: 다회전 대화 구조 (user 메시지 포함)
  - Given: generateDemoSteps 호출
  - When: 요구사항 분석 단계(step 0) chatSequence 확인
  - Then: user 타입 메시지가 2개 이상 존재
  - Requirement: CR-REQ-08
  - Status: Not Started

- **TC-C3-008**: 시나리오별 고유 콘텐츠
  - Given: scenarioId='ecommerce'와 'fintech'로 각각 호출
  - When: 동일 단계의 chatSequence 비교
  - Then: ai 메시지 내용이 서로 다름
  - Requirement: CR-REQ-08
  - Status: Not Started

---

## CR-08: 결과 화면 품질 강화

- **TC-C3-009**: AIDLCOutputsTab scenarioId 기반 분기
  - Given: scenarioId='ecommerce'
  - When: AIDLCOutputsTab 렌더링
  - Then: 이커머스 관련 산출물 콘텐츠 표시
  - Requirement: CR-REQ-09
  - Status: Not Started

- **TC-C3-010**: AWSArchitectureDiagram 보안/모니터링 레이어
  - Given: scenarioId='fintech'
  - When: AWSArchitectureDiagram 렌더링
  - Then: 보안 관련 서비스(KMS, CloudTrail, WAF) 포함
  - Requirement: CR-REQ-09
  - Status: Not Started

- **TC-C3-011**: BusinessWorkflowDiagram 예외 처리 포함
  - Given: scenarioId='ecommerce'
  - When: BusinessWorkflowDiagram 렌더링
  - Then: 에러 핸들링 또는 예외 처리 단계 포함
  - Requirement: CR-REQ-09
  - Status: Not Started

---

## CR-09: 안내 문구 수정

- **TC-C3-012**: 완료 메시지 버튼 위치 안내
  - Given: useRunStep이 step 완료
  - When: 완료 메시지 생성
  - Then: "우측 상단" 문구 포함, "아래" 문구 미포함
  - Requirement: CR-REQ-10
  - Status: Not Started

---

## CR-10: 성능 최적화

- **TC-C3-013**: 로컬 폰트 사용 확인
  - Given: layout.tsx 확인
  - When: 폰트 로딩 방식 확인
  - Then: next/font/local 사용 (Google Fonts 미사용)
  - Requirement: CR-REQ-11
  - Status: Not Started

---

## Requirements Coverage

| Requirement ID | Test Cases | Status |
|---------------|------------|--------|
| CR-REQ-06 | TC-C3-001, TC-C3-002, TC-C3-003 | Pending |
| CR-REQ-07 | TC-C3-004, TC-C3-005 | Pending |
| CR-REQ-08 | TC-C3-006, TC-C3-007, TC-C3-008 | Pending |
| CR-REQ-09 | TC-C3-009, TC-C3-010, TC-C3-011 | Pending |
| CR-REQ-10 | TC-C3-012 | Pending |
| CR-REQ-11 | TC-C3-013 | Pending |
