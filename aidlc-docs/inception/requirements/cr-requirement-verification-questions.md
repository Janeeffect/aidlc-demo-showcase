# 변경요건 (CR-01~CR-04) 검증 질문

변경요건 정의서 기반으로 구현 방향을 결정하기 위한 질문입니다.
각 질문의 [Answer]: 태그 뒤에 선택지를 기입해 주세요.

---

## Question 1
CR-01 관련: 각 산업별 시나리오의 Screen 2 콘텐츠(채팅 대화, 생성 파일, 에디터 내용)는 현재 `DemoStepGenerator.ts`에서 `detectScenario()` 결과를 기반으로 생성됩니다. 현재 7개 시나리오(이커머스, 핀테크, 헬스케어, 교육, 물류, SaaS, 채팅) + 1개 기본 시나리오가 정의되어 있습니다.

각 시나리오별 고유 콘텐츠를 어떻게 제공할까요?

A) 현재 `scenarios.ts`의 데이터를 확장하여 시나리오별 고유 채팅 대화/파일 내용을 정적으로 정의 (가장 안정적, 네트워크 불필요)
B) AI API를 호출하여 시나리오별 콘텐츠를 동적으로 생성 (다양하지만 네트워크 의존)
C) A + B 하이브리드: 기본 콘텐츠는 정적 정의, 선택적으로 AI 보강 (네트워크 실패 시 정적 콘텐츠 fallback)
D) Other (please describe after [Answer]: tag below)

[Answer]: c

---

## Question 2
CR-01/CR-04 관련: Screen 1에서 선택한 시나리오가 Screen 2와 Screen 3까지 End-to-End로 전달되어야 합니다. 현재는 `?idea=` query parameter로 텍스트만 전달하고, `detectScenario()`가 키워드 매칭으로 시나리오를 재감지합니다.

시나리오 전달 방식을 어떻게 개선할까요?

A) 현재 방식 유지 (`?idea=` + `detectScenario()` 재감지) - 시나리오 데이터만 확장하면 됨
B) `?idea=` + `?scenario=ecommerce` 처럼 시나리오 ID를 명시적으로 전달 (확실한 매핑)
C) DemoSessionContext에 선택된 시나리오 ID를 저장하여 전역 상태로 관리
D) Other (please describe after [Answer]: tag below)

[Answer]: 추천해줘,퀄리티높은 데모여야해 

---

## Question 3
CR-03 관련: 현재 `DemoPage`에서 `fileContentsMap` state로 파일별 콘텐츠를 관리하고 있으나, `handleFileClick`에서 `fileContentsMap[path]`가 빈 문자열이면 에디터에 아무것도 표시되지 않습니다. `useRunStep`의 `onEditorContent` 콜백이 현재 활성 파일의 내용만 업데이트하고, 이전 파일 내용은 `fileContentsMap`에 저장되지 않는 것이 원인입니다.

수정 방향은?

A) `onEditorContent` 콜백에서 현재 활성 파일의 내용을 `fileContentsMap`에 자동 저장하도록 수정 (최소 변경)
B) `useRunStep`에서 각 단계 완료 시 해당 단계의 `fileContent`를 `fileContentsMap`에 직접 저장 (더 확실한 매핑)
C) `DemoStep`의 `fileContent`를 직접 참조하여 파일 클릭 시 해당 단계의 콘텐츠를 표시 (가장 정확)
D) Other (please describe after [Answer]: tag below)

[Answer]: c

---

## Question 4
CR-04 관련: Screen 3(결과 화면)의 탭별 콘텐츠 분리 범위를 결정해야 합니다. 현재 6개 탭이 있습니다: MVP Preview, AWS Architecture, Business Workflow, Estimate, AI-DLC Outputs, Kiro 소개.

어떤 탭들의 콘텐츠를 시나리오별로 분리할까요?

A) 전체 탭 분리 (6개 모두 시나리오별 고유 콘텐츠)
B) 핵심 탭만 분리: MVP Preview, AWS Architecture, Business Workflow, Estimate (4개) - Kiro 소개와 AI-DLC Outputs는 공통
C) 최소 분리: MVP Preview, AWS Architecture (2개) - 나머지는 공통
D) Other (please describe after [Answer]: tag below)

[Answer]: a

---

## Question 5
CR-02 관련: 마우스 커서를 노란색 큰 원형으로 변경합니다. 현재 `MousePointer.tsx` 컴포넌트가 있으며 `AnimationOrchestrator`에서 사용됩니다.

커서 스타일 세부 사항은?

A) 노란색 원형 (지름 30px, 반투명 50%) + 중앙에 작은 점 (클릭 위치 표시)
B) 노란색 원형 (지름 40px, 반투명 30%) + 펄스 애니메이션 (주목도 높음)
C) 노란색 원형 (지름 30px, 반투명 50%) + 클릭 시 확대 효과 (인터랙션 피드백)
D) 추천해줘
E) Other (please describe after [Answer]: tag below)

[Answer]: b

---

## Question 6
CR-01/CR-04 관련: Screen 3의 MVP Preview는 현재 `detectScenario()`로 시나리오를 감지하여 산업별 하위 컴포넌트(EcommerceMVP, BookingMVP 등)를 lazy loading합니다. 그러나 AWS Architecture, Business Workflow, Estimate 탭은 시나리오별 분기가 없습니다.

이 탭들의 시나리오별 콘텐츠를 어떻게 구현할까요?

A) 각 탭 컴포넌트 내부에서 시나리오 ID를 받아 조건 분기 (기존 패턴 확장)
B) 시나리오별 데이터를 `scenarios.ts`에 추가하고, 각 탭에서 데이터만 참조 (데이터 중심)
C) 추천해줘
D) Other (please describe after [Answer]: tag below)

[Answer]: a
