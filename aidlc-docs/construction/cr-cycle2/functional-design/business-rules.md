# CR Cycle 2 - Business Rules

## BR-CR-01: 시나리오 ID 전달 규칙

| 규칙 | 설명 |
|------|------|
| BR-CR-01a | Screen 1에서 시나리오 선택 시 scenarioId를 URL query param으로 전달 |
| BR-CR-01b | URL에 `scenario` param이 없으면 `detectScenario(idea)`로 fallback |
| BR-CR-01c | DemoSessionContext에 scenarioId 저장, 전역 접근 가능 |
| BR-CR-01d | Screen 2 -> Screen 3 전환 시 scenarioId를 URL에 유지 |
| BR-CR-01e | 새로고침 시 URL의 scenario param에서 scenarioId 복원 |

---

## BR-CR-02: 시나리오별 채팅 메시지 규칙

| 규칙 | 설명 |
|------|------|
| BR-CR-02a | AI 메시지는 시나리오별 고유 콘텐츠 사용 |
| BR-CR-02b | 사용자 응답 메시지는 시나리오 공통 (ScenarioDefinition.questions 기반) |
| BR-CR-02c | 시스템 메시지는 공통 유지 (단계 안내 등) |
| BR-CR-02d | 시나리오별 demoContent.stepMessages가 없으면 기존 로직 fallback |

---

## BR-CR-03: 시나리오별 파일 콘텐츠 규칙

| 규칙 | 설명 |
|------|------|
| BR-CR-03a | 파일명은 7개 단계 공통 (requirements.md, user-stories.md 등) |
| BR-CR-03b | 파일 콘텐츠는 시나리오별 고유 데이터 사용 |
| BR-CR-03c | 콘텐츠 내 도메인명, 사용자 유형, 기능 목록이 시나리오에 맞게 표시 |
| BR-CR-03d | demoContent.stepFileContents가 없으면 기존 template builder 함수 fallback |

---

## BR-CR-04: 파일 탐색기 콘텐츠 연동 규칙

| 규칙 | 설명 |
|------|------|
| BR-CR-04a | 파일 클릭 시 demoSteps 배열에서 fileName 매칭하여 fileContent 직접 표시 |
| BR-CR-04b | 매칭되는 DemoStep이 없으면 fileContentsMap에서 조회 (보조) |
| BR-CR-04c | 이전 단계 파일 클릭 시 해당 단계의 fileContent 정확히 표시 |
| BR-CR-04d | 현재 진행 중인 단계의 파일도 최신 fileContent 표시 |

---

## BR-CR-05: MousePointer 시각적 규칙

| 규칙 | 설명 |
|------|------|
| BR-CR-05a | 기존 흰색 SVG 화살표 커서 유지 |
| BR-CR-05b | 커서 주변에 노란색 원형 하이라이트 추가 (지름 40px) |
| BR-CR-05c | 원형 색상: rgba(255, 215, 0, 0.3) (노란색, 반투명 30%) |
| BR-CR-05d | 펄스 애니메이션: scale 1.0 -> 1.3 -> 1.0, 1.5초 주기, 무한 반복 |
| BR-CR-05e | 클릭 시 기존 클릭 이펙트도 유지 |

---

## BR-CR-06: Screen 3 탭별 시나리오 분기 규칙

| 규칙 | 설명 |
|------|------|
| BR-CR-06a | 모든 6개 탭이 scenarioId 기반으로 콘텐츠 분기 |
| BR-CR-06b | MVP Preview: 기존 산업별 하위 컴포넌트 패턴 유지 (이미 구현됨) |
| BR-CR-06c | AWS Architecture: scenarioId -> architectureKey 매핑으로 Mermaid 다이어그램 선택 |
| BR-CR-06d | Business Workflow: scenarioId -> workflowKey 매핑으로 시퀀스 다이어그램 선택 |
| BR-CR-06e | Estimate: scenarioId -> estimateTemplate 매핑으로 고정 값 표시 (랜덤 제거) |
| BR-CR-06f | AI-DLC Outputs: scenarioId -> aidlcOutputs 매핑으로 산출물 콘텐츠 분기 |
| BR-CR-06g | Kiro 소개: 공통 Kiro 소개 + scenarioId별 활용 사례 섹션 추가 |

---

## BR-CR-07: 시나리오 Fallback 규칙

| 규칙 | 설명 |
|------|------|
| BR-CR-07a | scenarioId가 유효하지 않으면 DEFAULT_SCENARIO 사용 |
| BR-CR-07b | URL에 scenario param 없으면 detectScenario(idea)로 감지 |
| BR-CR-07c | detectScenario도 매칭 실패 시 DEFAULT_SCENARIO 사용 |
| BR-CR-07d | 네트워크 실패 시 정적 콘텐츠로 정상 동작 (AI 보강 없이) |

---

## BR-CR-08: 시나리오 End-to-End 일관성 규칙

| 규칙 | 설명 |
|------|------|
| BR-CR-08a | Screen 1에서 선택한 시나리오가 Screen 2, 3에서 동일하게 유지 |
| BR-CR-08b | 이커머스 선택 시 6개 탭 모두 이커머스 관련 콘텐츠 |
| BR-CR-08c | 8개 시나리오 + default 모두 End-to-End 콘텐츠 일관성 보장 |
| BR-CR-08d | 시나리오 전환 시 200ms 이내 콘텐츠 로드 (NFR-CR-02) |

---

## BR-CR-09: DemoStepGenerator 시나리오 분기 규칙

| 규칙 | 설명 |
|------|------|
| BR-CR-09a | generateDemoSteps(projectIdea, scenarioId) 시그니처로 변경 |
| BR-CR-09b | scenarioId가 있으면 SCENARIOS에서 직접 조회 (detectScenario 미사용) |
| BR-CR-09c | scenarioId가 없으면 기존 detectScenario(projectIdea) 사용 |
| BR-CR-09d | 시나리오별 demoContent가 있으면 우선 사용, 없으면 기존 template builder fallback |
