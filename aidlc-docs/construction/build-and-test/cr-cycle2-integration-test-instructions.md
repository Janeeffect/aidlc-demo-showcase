# CR Cycle 2 - Integration Test Instructions

## Purpose
Screen 1 -> Screen 2 -> Screen 3 간 scenarioId 전달 흐름 검증.

## Test Scenarios

### Scenario 1: scenarioId E2E 전달
1. Screen 1에서 산업 예시 클릭 -> detectScenario로 scenarioId 결정
2. URL에 `?idea=...&scenario=ecommerce` 형태로 Screen 2 이동
3. Screen 2에서 searchParams.get('scenario')로 scenarioId 획득
4. generateDemoSteps(idea, scenarioId) 호출 -> 시나리오별 콘텐츠 생성
5. 완료 시 result URL에 scenario param 유지
6. Screen 3에서 scenarioId 기반 탭별 콘텐츠 분기

### Scenario 2: scenarioId 없는 fallback
1. URL에 scenario param 없이 /demo?idea=... 접근
2. detectScenario(idea)로 자동 감지
3. 기존 로직과 동일하게 동작

## 수동 테스트 절차
```
1. npm run dev (port 3001)
2. 브라우저에서 http://localhost:3001 접속
3. 각 산업 카테고리 예시 클릭 -> 데모 진행 -> 결과 확인
4. URL에 scenario param이 유지되는지 확인
5. 결과 화면 6개 탭에서 시나리오별 콘텐츠 차이 확인
```

## 자동화 테스트
- ScenarioE2EConsistency.test.ts (TC-CR-020): 6 tests PASSED
- 전체 흐름 시뮬레이션 포함
