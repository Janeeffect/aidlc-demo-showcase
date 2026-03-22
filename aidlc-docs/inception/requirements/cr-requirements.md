# 변경요건 요구사항 정의서 (CR Cycle 2)

## Intent Analysis
- **User Request**: 변경요건 정의서 (CR-01~CR-04) 기반 기능 개선 및 버그 수정
- **Request Type**: Enhancement + Bug Fix
- **Scope**: Multiple Components (Screen 1, 2, 3 전체)
- **Complexity**: Moderate
- **입력 문서**: `변경요건 정의서 (2026.03.22 0940).txt`

---

## 요구사항 목록

### CR-REQ-01: 산업별 시나리오 콘텐츠 분리 (Screen 2)
- **CR 번호**: CR-01
- **우선순위**: 높음
- **유형**: Enhancement

**설명**: Screen 1에서 선택한 산업별 예시 시나리오에 따라 Screen 2에서 해당 산업 고유의 시나리오 콘텐츠가 표시되어야 한다.

**구현 방향**: 하이브리드 (정적 + AI 보강)
- `scenarios.ts`의 기존 `ScenarioDefinition`을 확장하여 시나리오별 고유 채팅 대화, 생성 파일명, 에디터 콘텐츠를 정적으로 정의
- 선택적으로 AI API를 호출하여 콘텐츠 보강 (네트워크 실패 시 정적 콘텐츠 fallback)
- `DemoStepGenerator.ts`의 `generateDemoSteps()`가 시나리오별 고유 데이터를 사용하도록 수정

**영향 파일**:
- `src/data/scenarios.ts` - 시나리오별 고유 콘텐츠 데이터 추가
- `src/utils/DemoStepGenerator.ts` - 시나리오별 분기 로직

**인수 기준**:
- 이커머스 시나리오 선택 시 이커머스 고유 채팅/파일/에디터 콘텐츠 표시
- 핀테크 시나리오 선택 시 핀테크 고유 콘텐츠 표시
- 모든 8개 시나리오가 구별되는 콘텐츠를 가짐
- 네트워크 실패 시 정적 콘텐츠로 정상 동작

---

### CR-REQ-02: 시나리오 End-to-End 전달 메커니즘
- **CR 번호**: CR-01, CR-04 (공통 인프라)
- **우선순위**: 높음
- **유형**: Enhancement

**설명**: Screen 1에서 선택한 시나리오가 Screen 2, Screen 3까지 정확하게 전달되어야 한다.

**구현 방향**: Query Parameter + Context 이중 전달
- `?idea=텍스트&scenario=ecommerce` 형태로 시나리오 ID를 URL에 명시적 전달
- `DemoSessionContext`에 `scenarioId` 필드 추가하여 전역 상태 관리
- Screen 2, 3에서 `scenarioId`로 직접 시나리오 데이터 조회 (`detectScenario()` 재감지 의존성 제거)
- URL에 시나리오 ID가 있으므로 새로고침/URL 공유 시에도 정확한 시나리오 유지

**영향 파일**:
- `src/app/page.tsx` (Screen 1) - 시나리오 선택 시 scenarioId 전달
- `src/contexts/DemoSessionContext.tsx` - scenarioId 필드 추가
- `src/app/demo/page.tsx` (Screen 2) - scenarioId 기반 데이터 조회
- `src/app/result/page.tsx` (Screen 3) - scenarioId 기반 탭 콘텐츠 분기

**인수 기준**:
- Screen 1에서 선택한 시나리오가 Screen 2, 3에서 동일하게 유지
- URL 새로고침 시에도 시나리오 유지
- `detectScenario()` 대신 명시적 ID로 시나리오 조회

---

### CR-REQ-03: 마우스 커서 시각적 개선
- **CR 번호**: CR-02
- **우선순위**: 중간
- **유형**: UI/UX 개선

**설명**: 현재 흰색 마우스 포인터를 노란색 큰 원형으로 변경하여 가시성을 확보한다.

**구현 방향**:
- `MousePointer.tsx` 컴포넌트 스타일 수정
- 형태: 원형 (지름 40px)
- 색상: 노란색 계열 (반투명 30%)
- 효과: 펄스 애니메이션 (주목도 높음)

**영향 파일**:
- `src/components/animation/MousePointer.tsx`

**인수 기준**:
- 커서가 노란색 원형 (40px, 반투명 30%)으로 표시
- 펄스 애니메이션이 지속적으로 동작
- 어두운 배경에서 커서 위치가 명확히 인식 가능

---

### CR-REQ-04: MD 파일 탐색기 콘텐츠 연동 수정
- **CR 번호**: CR-03
- **우선순위**: 높음
- **유형**: Bug Fix

**설명**: Screen 2의 파일 탐색기에서 파일 클릭 시 해당 파일의 고유 내용이 표시되어야 한다. 현재는 항상 최근 파일 내용만 표시됨.

**구현 방향**: DemoStep의 fileContent 직접 참조
- 파일 클릭 시 `demoSteps` 배열에서 해당 `fileName`과 매칭되는 `DemoStep`의 `fileContent`를 직접 표시
- `fileContentsMap` state 의존성 제거 또는 보조적으로만 사용
- 각 단계 완료 시 `fileContentsMap`에도 콘텐츠 저장하여 일관성 유지

**영향 파일**:
- `src/app/demo/page.tsx` - `handleFileClick` 로직 수정

**인수 기준**:
- 파일A 클릭 시 파일A 고유 내용 표시
- 파일B 클릭 시 파일B 고유 내용 표시
- 이전 단계 파일도 정확한 내용 표시
- 현재 진행 중인 단계의 파일도 정상 표시

---

### CR-REQ-05: 결과 화면 전체 탭 시나리오별 콘텐츠 분리 (Screen 3)
- **CR 번호**: CR-04
- **우선순위**: 높음
- **유형**: Enhancement

**설명**: Screen 3의 6개 탭 모두 선택된 시나리오에 맞는 고유 콘텐츠를 표시해야 한다.

**구현 방향**: 각 탭 컴포넌트 내부에서 시나리오 ID 조건 분기
- MVP Preview: 기존 산업별 하위 컴포넌트 패턴 유지 (이미 구현됨)
- AWS Architecture: 시나리오별 AWS 서비스 구성 다르게 표시
- Business Workflow: 시나리오별 비즈니스 흐름 다르게 표시
- Estimate: 시나리오별 팀 구성/일정/비용 다르게 산출
- AI-DLC Outputs: 시나리오별 산출물 내용 다르게 표시
- Kiro 소개: 시나리오별 Kiro 활용 사례 다르게 표시

**영향 파일**:
- `src/components/ui/AWSArchitectureDiagram.tsx`
- `src/components/ui/BusinessWorkflowDiagram.tsx`
- `src/services/EstimateService.ts`
- `src/app/result/page.tsx` (AIDLCOutputsTab, KiroIntroTab)

**인수 기준**:
- 이커머스 선택 시 6개 탭 모두 이커머스 관련 콘텐츠
- 핀테크 선택 시 6개 탭 모두 핀테크 관련 콘텐츠
- 모든 8개 시나리오에 대해 End-to-End 콘텐츠 일관성

---

## 비기능 요구사항

| ID | 카테고리 | 요구사항 | 비고 |
|------|----------|----------|------|
| NFR-CR-01 | 안정성 | 네트워크 실패 시 정적 콘텐츠 fallback | Summit 현장 네트워크 불안정 |
| NFR-CR-02 | 성능 | 시나리오 전환 시 200ms 이내 콘텐츠 로드 | 부스 데모 UX |
| NFR-CR-03 | 호환성 | 기존 240개 테스트 전체 통과 유지 | 회귀 방지 |
| NFR-CR-04 | 품질 | 2만명 Summit 참석자 대상 부스 데모 퀄리티 | 높은 완성도 필수 |

---

## 요약 매트릭스

| CR-REQ | CR 번호 | 유형 | 우선순위 | 영향 범위 |
|--------|---------|------|----------|-----------|
| CR-REQ-01 | CR-01 | Enhancement | 높음 | Screen 2 콘텐츠 |
| CR-REQ-02 | CR-01/04 | Enhancement | 높음 | 전체 (인프라) |
| CR-REQ-03 | CR-02 | UI/UX | 중간 | Animation |
| CR-REQ-04 | CR-03 | Bug Fix | 높음 | Screen 2 파일 탐색기 |
| CR-REQ-05 | CR-04 | Enhancement | 높음 | Screen 3 전체 탭 |
